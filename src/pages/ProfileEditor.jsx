import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom'
import {
  ArrowLeft, Save, Loader2, Check, AlertCircle, Upload, X, Plus, Star,
  FileText, LogOut, Shield, Trash2,
} from 'lucide-react'
import {
  getEditableProfile, updateEditableProfile, uploadProfileAssets, deleteProfileAsset, ApiError,
} from '../lib/soccerexApi'
import {
  readProfileAccessSession, clearProfileAccessSession,
} from '../lib/profileAccessAuth'
import { isTestModeFromUrl, withTestSearch } from '../lib/testMode'
import { PROFILE_ACCESS, PROFILE_EXPIRED } from '../lib/routes'

const COMPANY_TYPES = new Set(['brand', 'club', 'federation', 'company', 'organisation'])

const KIND_LABELS = {
  headshot: 'Headshot',
  photo:    'Photo',
  banner:   'Banner',
  logo:     'Logo',
  artwork:  'Artwork',
  signage:  'Signage',
  deck:     'Deck',
  pdf:      'PDF / document',
  other:    'Other',
}

/* Fallback kinds used only when the API does not return asset_options. The
   server is now authoritative — these are last-resort defaults. */
const FALLBACK_KINDS_PERSON  = ['headshot', 'photo', 'banner', 'pdf', 'other']
const FALLBACK_KINDS_COMPANY = ['logo', 'banner', 'photo', 'artwork', 'signage', 'deck', 'pdf', 'other']
const FALLBACK_FEATURED_PERSON  = ['headshot', 'photo', 'banner']
const FALLBACK_FEATURED_COMPANY = ['logo', 'banner']

/* Known social keys the form surfaces first; the rest are rendered dynamically
   in the order they come back from the API. */
const KNOWN_SOCIALS = ['linkedin', 'twitter', 'x', 'instagram', 'youtube', 'facebook', 'tiktok', 'github', 'threads', 'bluesky']

export default function ProfileEditor() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [session, setSession] = useState(() => readProfileAccessSession())

  const [profile, setProfile] = useState(null)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveResult, setSaveResult] = useState(null) /* { status: 'success'|'error', message } */
  const [form, setForm] = useState(null)

  /* Bounce out if no token */
  useEffect(() => {
    if (!session || !session.edit_token) {
      navigate(PROFILE_ACCESS, { replace: true })
    }
  }, [session, navigate])

  /* When this edit session was created in test mode but the URL is missing
     ?test=1 (e.g. user pasted /profile-access/edit/slug directly), append it
     so the global test-mode banner appears and any internal Link copies work. */
  useEffect(() => {
    if (!session?.is_test) return
    if (isTestModeFromUrl()) return
    const params = new URLSearchParams(location.search)
    params.set('test', '1')
    navigate({ pathname: location.pathname, search: `?${params.toString()}` }, { replace: true })
  }, [session, location.pathname, location.search, navigate])

  const editToken = session?.edit_token
  const isTest = !!session?.is_test

  /* Load profile */
  useEffect(() => {
    if (!editToken) return
    let cancelled = false
    setProfile(null); setForm(null); setError(null)
    getEditableProfile(slug, editToken, { test: isTest })
      .then((p) => { if (!cancelled) { setProfile(p); setForm(toFormState(p)) } })
      .catch((err) => {
        if (cancelled) return
        if (err instanceof ApiError && err.status === 401) {
          clearProfileAccessSession()
          setSession(null)
          navigate(PROFILE_EXPIRED, { replace: true })
          return
        }
        setError(err)
      })
    return () => { cancelled = true }
  }, [slug, editToken, isTest, navigate])

  const profileType = profile?.type || profile?.profile_type
  /* The API now returns profile_kind ("person" | "company") and is_company.
     Prefer those; fall back to the legacy type sniff for older responses. */
  const profileKind = profile?.profile_kind
  const isCompany = profileKind
    ? profileKind === 'company'
    : profile?.is_company !== undefined
      ? !!profile.is_company
      : profileType && COMPANY_TYPES.has(String(profileType).toLowerCase())

  const assetOptions = profile?.asset_options || {}
  const allowedKinds = Array.isArray(assetOptions.allowed_kinds) && assetOptions.allowed_kinds.length > 0
    ? assetOptions.allowed_kinds
    : (isCompany ? FALLBACK_KINDS_COMPANY : FALLBACK_KINDS_PERSON)
  const featuredKinds = Array.isArray(assetOptions.featured_kinds)
    ? assetOptions.featured_kinds
    : (isCompany ? FALLBACK_FEATURED_COMPANY : FALLBACK_FEATURED_PERSON)
  const kindOptions = allowedKinds.map((k) => ({ value: k, label: KIND_LABELS[k] || prettyKey(k) }))
  /* Upload limits + the large-file guidance disclaimer surface inside the
     uploader. limits is preferred at the top level of the profile; the
     guidance can also arrive via asset_options. */
  const uploadLimits = profile?.limits || {}
  const largeFileGuidance = uploadLimits.large_file_guidance || assetOptions.large_file_guidance || null

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const updateRaw = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const onSave = async (e) => {
    e?.preventDefault?.()
    if (!form) return
    setSaving(true)
    setSaveResult(null)
    try {
      const patch = toApiPatch(form)
      const updated = await updateEditableProfile(slug, editToken, patch, { test: isTest })
      setProfile(updated)
      setForm(toFormState(updated))
      setSaveResult({ status: 'success', message: 'Submitted for review.' })
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        clearProfileAccessSession()
        setSession(null)
        navigate(PROFILE_EXPIRED, { replace: true })
        return
      }
      const detail = err instanceof ApiError && err.body?.errors
        ? Object.values(err.body.errors).flat().join(' ')
        : err.message
      setSaveResult({ status: 'error', message: detail })
    } finally {
      setSaving(false)
    }
  }

  const signOut = () => {
    clearProfileAccessSession()
    navigate(PROFILE_ACCESS, { replace: true })
  }

  if (!editToken) return null /* redirect in flight */

  return (
    <div className="event-page theme-soccerex" style={{
      background: '#FAFBFC',
      minHeight: '100vh',
      /* Push the page (and the sticky EditorHeader below) clear of
         the fixed navbar + test banner so the title strip stops
         fighting them for top: 0. --app-top-offset is published
         from index.css and bumped by the test banner when active. */
      paddingTop: 'var(--app-top-offset)',
    }}>
      <EditorHeader profile={profile} session={session} onSignOut={signOut} />

      <section style={{ padding: 'clamp(24px,3vw,40px) clamp(24px,5vw,60px) clamp(80px,10vw,120px)' }}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          {error && <ErrorBanner error={error} />}
          {!error && !profile && <Loading label="Loading profile" />}

          {profile && form && (
            <form onSubmit={onSave} className="flex flex-col gap-6">
              <PendingRevisionBanner profile={profile} />

              <FormCard
                kicker={isCompany ? 'Company' : 'Person'}
                title="Identity"
                subtitle="Public-facing name and contact details. Changes here are submitted for review.">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Display name *">
                    <input required value={form.display_name} onChange={update('display_name')} className="prog-input" />
                  </Field>
                  <Field label="Legal name">
                    <input value={form.legal_name} onChange={update('legal_name')} className="prog-input" />
                  </Field>
                  <Field label="Email">
                    <input type="email" value={form.email} onChange={update('email')} className="prog-input" />
                  </Field>
                  <Field label="Phone">
                    <input value={form.phone} onChange={update('phone')} className="prog-input" />
                  </Field>
                  <Field label="Website">
                    <input type="url" value={form.website_url} onChange={update('website_url')} placeholder="https://" className="prog-input" />
                  </Field>
                  <Field label="Headline">
                    <input value={form.headline} onChange={update('headline')} className="prog-input" placeholder={isCompany ? 'What you do, in one line' : 'Title and company'} />
                  </Field>
                </div>
              </FormCard>

              <FormCard
                title={isCompany ? 'About the company' : 'Bio'}
                subtitle={isCompany
                  ? 'A short overview that appears on the public company profile.'
                  : 'A short biography that appears on the public speaker profile.'}>
                <Field label="">
                  <textarea rows={6} value={form.bio} onChange={update('bio')} className="prog-input"
                    placeholder={isCompany ? 'Two or three sentences about the company...' : 'Two or three sentences about yourself...'} />
                </Field>
              </FormCard>

              <FormCard title="Social profiles" subtitle="Add the URLs you want public. Leave blank to remove.">
                <SocialsEditor value={form.socials} onChange={(v) => updateRaw('socials', v)} />
              </FormCard>

              <FormCard title="Other links" subtitle="Press, papers, talks, anything else worth pointing at.">
                <LinksEditor
                  /* The Brand Assets card owns links tagged
                     category: 'asset' (Dropbox / Drive folders for
                     internal review). Don't surface those here, and
                     preserve them on save by merging back in. */
                  value={(form.links || []).filter((l) => !l || l.category !== 'asset')}
                  onChange={(v) => {
                    const assetLinks = (form.links || []).filter((l) => l && l.category === 'asset')
                    updateRaw('links', [...v.map((l) => ({ ...l, category: undefined })), ...assetLinks])
                  }}
                />
              </FormCard>

              <FormCard title="Search tags"
                subtitle="Keywords that help the Soccerex program team find this profile. Commas or returns separate them.">
                <Field label="">
                  <input value={form.search_tags_input} onChange={update('search_tags_input')} className="prog-input"
                    placeholder="commercial, sponsorship, world-cup-2026" />
                </Field>
              </FormCard>

              {/* Sticky save bar */}
              <div className="profile-editor-save-bar">
                <div>
                  {saveResult?.status === 'success' && (
                    <p className="flex items-center gap-2" style={{ fontSize: 13, color: '#10b981' }}>
                      <Check size={15} /> {saveResult.message} The Soccerex team will publish approved changes.
                    </p>
                  )}
                  {saveResult?.status === 'error' && (
                    <p className="flex items-center gap-2" style={{ fontSize: 13, color: '#b91c1c' }}>
                      <AlertCircle size={15} /> {saveResult.message}
                    </p>
                  )}
                  {!saveResult && (
                    <p className="miami-body" style={{ fontSize: 12, color: '#607186' }}>
                      <Shield size={11} style={{ display: 'inline', marginRight: 4 }} />
                      Edits are submitted for admin review before they go live.
                    </p>
                  )}
                </div>
                <button type="submit" disabled={saving} className="miami-pill-primary">
                  {saving ? <><Loader2 size={15} className="prog-spin" /> Submitting</> : <><Save size={15} /> Submit for review</>}
                </button>
              </div>

              {/* Asset uploads (independent of the patch submission) */}
              <FormCard
                title={isCompany ? 'Brand assets and documents' : 'Photo, headshot, and documents'}
                subtitle={isCompany
                  ? 'Upload your logo, banner, artwork, signage, decks, and other materials. Featured logos / banners are submitted for review.'
                  : 'Upload a headshot, banner, or supporting documents. Featured headshot or banner changes are submitted for review.'}>
                <AssetUploader
                  slug={slug} editToken={editToken} kindOptions={kindOptions}
                  featuredKinds={featuredKinds}
                  limits={uploadLimits}
                  largeFileGuidance={largeFileGuidance}
                  isTest={isTest}
                  onUnauthorized={signOut}
                  /* Upload response now carries a refreshed profile. Lift
                     it into editor state so the asset list re-renders
                     without a manual refresh. */
                  onProfileRefreshed={(next) => { setProfile(next); setForm(toFormState(next)) }}
                />
                <AssetList
                  profile={profile}
                  slug={slug}
                  editToken={editToken}
                  isTest={isTest}
                  onProfileRefreshed={(next) => { setProfile(next); setForm(toFormState(next)) }}
                  onUnauthorized={signOut}
                />
                <SharedAssetLinks
                  profile={profile}
                  slug={slug}
                  editToken={editToken}
                  isTest={isTest}
                  onProfileRefreshed={(next) => { setProfile(next); setForm(toFormState(next)) }}
                  onUnauthorized={signOut}
                />
              </FormCard>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}

/* ─── Header strip ──────────────────────────────────────────────────────── */

function EditorHeader({ profile, session, onSignOut }) {
  const expiresAt = session?.expires_at ? new Date(session.expires_at) : null
  return (
    <header style={{
      /* Sticks just below the navbar (and test banner when active),
         not at viewport top: 0. The navbar at z-index 50 would
         otherwise cover the title strip. */
      position: 'sticky', top: 'var(--app-top-offset)', zIndex: 20,
      background: '#FFFFFF',
      borderBottom: '1px solid rgba(13,27,42,0.08)',
      padding: 'clamp(14px, 2vw, 22px) clamp(24px, 5vw, 60px)',
      backdropFilter: 'blur(8px)',
    }}>
      <div className="flex items-center justify-between gap-6 flex-wrap" style={{ maxWidth: 980, margin: '0 auto' }}>
        <div className="flex items-center gap-4 flex-wrap">
          <Link to={withTestSearch(PROFILE_ACCESS)} className="inline-flex items-center gap-2 font-mono uppercase tracking-widest"
            style={{ fontSize: 11, color: '#0D1B2A', opacity: 0.55, textDecoration: 'none' }}>
            <ArrowLeft size={13} /> Profiles
          </Link>
          <span style={{ width: 1, height: 18, background: 'rgba(13,27,42,0.15)' }} />
          <div>
            <p className="miami-subhead" style={{ fontSize: 10, color: 'var(--event-primary)', letterSpacing: '0.2em' }}>
              {[profile?.profile_kind, profile?.type].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).join(' · ') || 'Profile'}
            </p>
            <p className="miami-headline" style={{ fontSize: 16, color: '#0D1B2A' }}>
              {profile?.display_name || profile?.legal_name || '...'}
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

/* ─── Pending revision banner ───────────────────────────────────────────── */

function PendingRevisionBanner({ profile }) {
  const pending = profile?.pending_revision || profile?.pending_revisions
  if (!pending) return null
  const count = Array.isArray(pending) ? pending.length : 1
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl" style={{ background: 'var(--event-tile-soft)', border: '1px solid var(--event-primary-border)' }}>
      <Shield size={18} style={{ color: 'var(--event-primary)', flexShrink: 0, marginTop: 2 }} />
      <div>
        <p className="miami-headline" style={{ fontSize: 14, color: '#0D1B2A' }}>
          You have {count} {count === 1 ? 'change' : 'changes'} awaiting review
        </p>
        <p className="miami-body" style={{ fontSize: 12, color: '#3a4a5a', marginTop: 4 }}>
          Your last submission is with the Soccerex program team. Public visitors still see the previously published version until your changes are approved.
        </p>
      </div>
    </div>
  )
}

/* ─── Socials / Links editors ───────────────────────────────────────────── */

function SocialsEditor({ value, onChange }) {
  /* value is an object: { linkedin: url, twitter: url, ... }. We always render
     the known keys, plus any extras coming back from the API. */
  const v = value || {}
  const allKeys = Array.from(new Set([...KNOWN_SOCIALS, ...Object.keys(v)]))
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {allKeys.map((key) => (
        <Field key={key} label={prettyKey(key)}>
          <input type="url" value={v[key] || ''}
            onChange={(e) => onChange({ ...v, [key]: e.target.value })}
            placeholder="https://" className="prog-input" />
        </Field>
      ))}
    </div>
  )
}

function LinksEditor({ value, onChange }) {
  const rows = Array.isArray(value) ? value : []
  const update = (i, field, val) => {
    const next = rows.slice()
    next[i] = { ...next[i], [field]: val }
    onChange(next)
  }
  const remove = (i) => onChange(rows.filter((_, idx) => idx !== i))
  const add = () => onChange([...rows, { label: '', url: '' }])

  return (
    <div className="flex flex-col gap-3">
      {rows.length === 0 && (
        <p className="miami-body" style={{ fontSize: 12, color: '#607186' }}>No other links yet.</p>
      )}
      {rows.map((row, i) => (
        <div key={i} className="grid gap-2" style={{ gridTemplateColumns: '1fr 2fr auto', alignItems: 'end' }}>
          <Field label="Label">
            <input value={row.label || ''} onChange={(e) => update(i, 'label', e.target.value)} className="prog-input" placeholder="Press release" />
          </Field>
          <Field label="URL">
            <input type="url" value={row.url || ''} onChange={(e) => update(i, 'url', e.target.value)} className="prog-input" placeholder="https://" />
          </Field>
          <button type="button" onClick={() => remove(i)} aria-label="Remove link" style={removeBtnStyle}>
            <Trash2 size={15} />
          </button>
        </div>
      ))}
      <button type="button" onClick={add} className="event-btn-outline-light" style={{ alignSelf: 'flex-start' }}>
        <Plus size={14} /> Add link
      </button>
    </div>
  )
}

/* ─── Asset uploader ────────────────────────────────────────────────────── */

function AssetUploader({ slug, editToken, kindOptions, featuredKinds = [], limits = {}, largeFileGuidance, isTest, onUnauthorized, onProfileRefreshed }) {
  const [kind, setKind] = useState(kindOptions[0]?.value || 'photo')
  const featuredAllowed = featuredKinds.includes(kind)
  /* Featured defaults ON for headshots only: a speaker asked for a headshot
     should propose the profile photo without discovering a checkbox (the
     chase emails depend on this to complete), but a company uploading a
     one-off logo variant or gallery photo must NOT silently propose swapping
     the live image. Switching kinds resets to that default, and we never
     POST featured=1 for a kind the server will reject. */
  const featuredDefault = featuredAllowed && kind === 'headshot'
  const [featured, setFeatured] = useState(featuredDefault)
  useEffect(() => {
    setFeatured(featuredDefault)
  }, [featuredDefault])
  const [altText, setAltText] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [files, setFiles] = useState([])
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')
  /* The most-recent upload's response data.assets[] — surfaced as a
     "Just uploaded" preview row inline above the full asset list. */
  const [recentUploads, setRecentUploads] = useState([])
  const inputRef = useRef(null)

  /* Build the file input's `accept` attribute from the backend's allowed
     types so the OS file picker filters correctly. Falls back to images
     only when limits don't list documents (e.g., a person profile that
     can't upload PDFs/decks). */
  const allowedImageTypes = Array.isArray(limits.allowed_image_types) ? limits.allowed_image_types : []
  const allowedDocumentTypes = Array.isArray(limits.allowed_document_types) ? limits.allowed_document_types : []
  const acceptAttr = [...allowedImageTypes, ...allowedDocumentTypes]
    .map((t) => t.includes('/') ? t : `.${t.replace(/^\./, '')}`)
    .join(',')
  const maxFiles = Number.isFinite(limits.max_files_per_upload) ? limits.max_files_per_upload : null
  const maxImageMb = limits.max_image_mb ?? null
  const maxDocMb = limits.max_document_mb ?? null

  const reset = () => {
    setFiles([]); setAltText(''); setTagsInput(''); setFeatured(featuredDefault)
    if (inputRef.current) inputRef.current.value = ''
  }

  const submit = async (e) => {
    e.preventDefault()
    if (files.length === 0) return
    if (maxFiles != null && files.length > maxFiles) {
      setStatus('error')
      setMessage(`You can upload up to ${maxFiles} file${maxFiles === 1 ? '' : 's'} at a time. Remove a few and try again.`)
      return
    }
    setStatus('uploading'); setMessage('')
    try {
      const tags = tagsInput.split(/[,\n]/).map((t) => t.trim()).filter(Boolean)
      const result = await uploadProfileAssets(slug, editToken, { kind, featured, alt_text: altText, tags, files }, { test: isTest })
      const newAssets = Array.isArray(result?.assets) ? result.assets : []
      const refreshedProfile = result?.profile || null

      setStatus('success')
      const featuredMsg = featured ? ' Submitted for review.' : ' Added to your library.'
      setMessage(`${files.length} file${files.length === 1 ? '' : 's'} uploaded.${featuredMsg}`)
      setRecentUploads(newAssets)

      /* Lift the refreshed profile up so the asset list and any new
         limits/options re-render without a manual refresh. */
      if (refreshedProfile && typeof onProfileRefreshed === 'function') {
        onProfileRefreshed(refreshedProfile)
      }
      reset()
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) return onUnauthorized()
      const detail = err instanceof ApiError && err.body?.errors
        ? Object.values(err.body.errors).flat().join(' ')
        : err.message
      setStatus('error')
      setMessage(detail || 'Upload failed.')
    }
  }

  return (
    /* This is a <div>, not a <form>, because the whole editor is already
       wrapped in the profile-patch <form>. HTML forbids nested forms — an
       inner <form> gets ignored by the parser and the inner submit button
       submits the OUTER form instead (which reloaded the page and made
       the upload look like it did nothing). Triggering submit from the
       button's onClick keeps the upload flow self-contained. */
    <div className="flex flex-col gap-3 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Asset kind">
          <select value={kind} onChange={(e) => setKind(e.target.value)} className="prog-input">
            {kindOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </Field>
        <Field label="Alt text (optional)">
          <input value={altText} onChange={(e) => setAltText(e.target.value)} className="prog-input" placeholder="Describe the image" />
        </Field>
      </div>
      <Field label="Tags (comma separated)">
        <input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} className="prog-input" placeholder="hero, dark-mode" />
      </Field>
      <label className="flex items-center gap-2" style={{ fontSize: 12, color: featuredAllowed ? '#3a4a5a' : '#9aa6b3' }}>
        <input type="checkbox" checked={featured} disabled={!featuredAllowed}
          onChange={(e) => setFeatured(e.target.checked)} />
        <Star size={13} style={{ color: featuredAllowed ? 'var(--event-primary)' : '#9aa6b3' }} />
        {featuredAllowed
          ? <>Make this the featured {kind} (featured changes go through review)</>
          : <>Featured uploads are only available for: {featuredKinds.join(', ') || 'no kinds'}</>}
      </label>
      {/* Upload limits + large-file guidance disclaimer. Renders the
          backend-provided constraints so the user knows what they can
          send before they pick anything. */}
      {(maxFiles != null || maxImageMb || maxDocMb || largeFileGuidance) && (
        <div style={{
          background: '#FAFBFC',
          border: '1px solid rgba(13,27,42,0.08)',
          borderRadius: 8,
          padding: '10px 14px',
        }}>
          <p className="font-mono uppercase mb-1.5" style={{ fontSize: 10, letterSpacing: '0.18em', color: '#607186' }}>
            Upload limits
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-1" style={{ fontSize: 12, color: '#3a4a5a' }}>
            {maxFiles != null && <span><strong style={{ color: '#0D1B2A' }}>{maxFiles}</strong> file{maxFiles === 1 ? '' : 's'} per upload</span>}
            {maxImageMb && <span>Images up to <strong style={{ color: '#0D1B2A' }}>{maxImageMb} MB</strong></span>}
            {maxDocMb && <span>Documents up to <strong style={{ color: '#0D1B2A' }}>{maxDocMb} MB</strong></span>}
          </div>
          {(allowedImageTypes.length > 0 || allowedDocumentTypes.length > 0) && (
            <p className="font-body mt-1.5" style={{ fontSize: 11.5, color: '#607186' }}>
              Accepted: {[...allowedImageTypes, ...allowedDocumentTypes].join(', ')}
            </p>
          )}
          {largeFileGuidance && (
            <p className="font-body mt-2" style={{ fontSize: 12, color: '#3a4a5a', borderLeft: '2px solid var(--event-primary)', paddingLeft: 10 }}>
              {largeFileGuidance}
            </p>
          )}
        </div>
      )}

      <div className="profile-uploader-drop">
        <input ref={inputRef} type="file" multiple accept={acceptAttr || undefined}
          onChange={(e) => setFiles(Array.from(e.target.files || []))} style={{ display: 'block' }} />
        {files.length > 0 && (
          <ul className="mt-2 flex flex-col gap-1">
            {files.map((f, i) => (
              <li key={i} className="flex items-center justify-between gap-2" style={{ fontSize: 12, color: '#3a4a5a' }}>
                <span>{f.name} <span style={{ color: '#607186' }}>({(f.size / 1024).toFixed(0)} KB)</span></span>
                <button type="button" onClick={() => setFiles(files.filter((_, idx) => idx !== i))} aria-label="Remove file"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#607186' }}>
                  <X size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <button type="button" onClick={submit}
          disabled={status === 'uploading' || files.length === 0} className="event-btn-outline-light">
          {status === 'uploading' ? <><Loader2 size={14} className="prog-spin" /> Uploading</> : <><Upload size={14} /> Upload</>}
        </button>
        {status === 'success' && (
          <span style={{ fontSize: 13, color: '#10b981' }} className="flex items-center gap-1.5">
            <Check size={14} /> {message}
          </span>
        )}
        {status === 'error' && (
          <span style={{ fontSize: 13, color: '#b91c1c' }} className="flex items-center gap-1.5">
            <AlertCircle size={14} /> {message}
          </span>
        )}
      </div>

      {/* Just-uploaded preview row. Renders the assets returned by the
          POST response so the user sees their new files immediately,
          without having to scroll down to the full library. */}
      {status === 'success' && recentUploads.length > 0 && (
        <div style={{ borderTop: '1px solid rgba(13,27,42,0.08)', paddingTop: 14, marginTop: 6 }}>
          <p className="miami-subhead mb-2" style={{ fontSize: 11, color: '#10b981', letterSpacing: '0.16em' }}>
            <Check size={11} style={{ display: 'inline', marginRight: 4 }} />
            Just uploaded
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {recentUploads.map((a) => <AssetThumb key={a.id || a.url || a.path} asset={a} />)}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Shared asset links (Dropbox / Drive / WeTransfer / etc.) ──────────────
 * Lives inside the Brand Assets card. Stores entries in profile.links
 * tagged with `category: 'asset'` so they don't collide with the public
 * "Other links" list (press, papers, talks). Has its own save action so
 * link edits don't depend on the main form's submit button above. */
function SharedAssetLinks({ profile, slug, editToken, isTest, onProfileRefreshed, onUnauthorized }) {
  const allLinks = Array.isArray(profile?.links) ? profile.links : []
  const initial = allLinks.filter((l) => l && l.category === 'asset')
  const [rows, setRows] = useState(initial.length > 0 ? initial : [])
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState(null)

  /* Reset local state when the upstream profile changes (e.g. after a
     refresh from an upload elsewhere). */
  useEffect(() => {
    setRows(allLinks.filter((l) => l && l.category === 'asset'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(allLinks)])

  const add = () => setRows((r) => [...r, { label: '', url: '', category: 'asset', note: '' }])
  const update = (i, field, val) => setRows((r) => {
    const next = r.slice()
    next[i] = { ...next[i], [field]: val }
    return next
  })
  const remove = (i) => setRows((r) => r.filter((_, idx) => idx !== i))

  const dirty = JSON.stringify(rows) !== JSON.stringify(initial)

  async function save() {
    if (saving) return
    setSaving(true); setStatus(null)
    try {
      /* Merge: keep all NON-asset links from upstream untouched,
         append the cleaned asset rows. Drop blank URLs. */
      const otherLinks = allLinks.filter((l) => !l || l.category !== 'asset')
      const cleanedAssets = rows
        .map((r) => ({
          label: (r.label || '').trim(),
          url: (r.url || '').trim(),
          note: (r.note || '').trim(),
          category: 'asset',
        }))
        .filter((r) => r.url)
      const merged = [...otherLinks, ...cleanedAssets]
      const updated = await updateEditableProfile(slug, editToken, { links: merged }, { test: isTest })
      if (updated && typeof onProfileRefreshed === 'function') onProfileRefreshed(updated)
      setStatus({ kind: 'success', message: 'Submitted for review.' })
    } catch (err) {
      if (err instanceof ApiError && err.status === 401 && typeof onUnauthorized === 'function') {
        onUnauthorized()
        return
      }
      const detail = err instanceof ApiError && err.body?.errors
        ? Object.values(err.body.errors).flat().join(' ')
        : err.message
      setStatus({ kind: 'error', message: detail || 'Could not save the links.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ borderTop: '1px solid rgba(13,27,42,0.08)', paddingTop: 22, marginTop: 22 }}>
      <div className="mb-3">
        <p className="miami-subhead" style={{ fontSize: 10, color: 'var(--event-secondary, #BFA46F)', letterSpacing: '0.22em', marginBottom: 6 }}>
          OFF-PLATFORM ASSETS
        </p>
        <h3 className="miami-headline" style={{ fontSize: '0.98rem', color: '#0D1B2A', marginBottom: 4 }}>
          Shared links to assets hosted elsewhere
        </h3>
        <p className="miami-body" style={{ fontSize: 12.5, color: '#586778', lineHeight: 1.55 }}>
          Use this for large decks, full brand packages, video, or any folder you'd rather host on Dropbox, Google Drive, WeTransfer, Box, Notion, or similar. The Soccerex team reviews these alongside your uploaded files.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {rows.length === 0 && (
          <p className="miami-body" style={{ fontSize: 12, color: '#7a8896' }}>
            No shared links yet. Add a Dropbox or Drive URL below.
          </p>
        )}
        {rows.map((row, i) => (
          <div key={i} style={{
            background: '#FAFBF8',
            border: '1px solid rgba(13,27,42,0.07)',
            borderRadius: 10,
            padding: 14,
          }}>
            <div className="grid gap-2" style={{ gridTemplateColumns: 'minmax(160px, 1fr) 2fr auto', alignItems: 'end' }}>
              <Field label="Label">
                <input
                  value={row.label || ''}
                  onChange={(e) => update(i, 'label', e.target.value)}
                  className="prog-input"
                  placeholder="Brand package, signage files…"
                />
              </Field>
              <Field label="Shared URL">
                <input
                  type="url"
                  value={row.url || ''}
                  onChange={(e) => update(i, 'url', e.target.value)}
                  className="prog-input"
                  placeholder="https://drive.google.com/…  ·  https://dropbox.com/…"
                />
              </Field>
              <button type="button" onClick={() => remove(i)} aria-label="Remove link" style={removeBtnStyle}>
                <Trash2 size={15} />
              </button>
            </div>
            <Field label="Note (optional)">
              <input
                value={row.note || ''}
                onChange={(e) => update(i, 'note', e.target.value)}
                className="prog-input"
                placeholder="What's in the folder, password if any, expiry, etc."
              />
            </Field>
          </div>
        ))}

        <div className="flex items-center justify-between gap-3 flex-wrap">
          <button type="button" onClick={add} className="event-btn-outline-light" style={{ alignSelf: 'flex-start' }}>
            <Plus size={14} /> Add shared link
          </button>
          <div className="flex items-center gap-3 flex-wrap">
            {status?.kind === 'success' && (
              <span className="flex items-center gap-1.5" style={{ fontSize: 12.5, color: '#10b981' }}>
                <Check size={13} /> {status.message}
              </span>
            )}
            {status?.kind === 'error' && (
              <span className="flex items-center gap-1.5" style={{ fontSize: 12.5, color: '#b91c1c' }}>
                <AlertCircle size={13} /> {status.message}
              </span>
            )}
            <button
              type="button"
              onClick={save}
              disabled={saving || !dirty}
              className="miami-pill-primary"
              style={{ opacity: saving || !dirty ? 0.6 : 1 }}
            >
              {saving ? <><Loader2 size={14} className="prog-spin" /> Saving</> : <><Save size={14} /> Save shared links</>}
            </button>
          </div>
        </div>
        <p className="miami-body" style={{ fontSize: 11.5, color: '#7a8896', marginTop: 4 }}>
          <Shield size={11} style={{ display: 'inline', marginRight: 4 }} />
          Link edits are submitted for admin review, same as profile changes above.
        </p>
      </div>
    </div>
  )
}

function AssetList({ profile, slug, editToken, isTest, onProfileRefreshed, onUnauthorized }) {
  const assets = profile?.assets || []
  const [deletingId, setDeletingId] = useState(null)
  const [errorId, setErrorId] = useState(null)

  async function handleDelete(asset) {
    if (!asset?.id) return
    if (typeof window !== 'undefined' && !window.confirm(`Delete ${asset.filename || asset.kind || 'this asset'}?`)) return
    setErrorId(null)
    setDeletingId(asset.id)
    try {
      const result = await deleteProfileAsset(slug, editToken, asset.id, { test: isTest })
      const refreshed = result?.profile || result?.data?.profile
      if (refreshed && typeof onProfileRefreshed === 'function') {
        onProfileRefreshed(refreshed)
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 401 && typeof onUnauthorized === 'function') {
        onUnauthorized()
        return
      }
      setErrorId(asset.id)
    } finally {
      setDeletingId(null)
    }
  }

  if (assets.length === 0) {
    return <p className="miami-body" style={{ fontSize: 12, color: '#607186' }}>No assets uploaded yet.</p>
  }
  return (
    <div>
      <p className="miami-subhead" style={{ fontSize: 11, color: 'var(--event-secondary)', marginBottom: 12 }}>Already uploaded</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {assets.map((a) => (
          <AssetThumb
            key={a.id || a.url || a.path}
            asset={a}
            onDelete={a.id ? () => handleDelete(a) : undefined}
            deleting={deletingId === a.id}
            errored={errorId === a.id}
          />
        ))}
      </div>
    </div>
  )
}

function AssetThumb({ asset, onDelete, deleting, errored }) {
  /* The backend serializer may surface the asset's URL under any of these
     keys depending on whether it's a public file, a signed temporary URL,
     or a thumbnail. Resolve in priority order so we never render an empty
     image box while a usable URL is sitting in the payload. */
  const previewUrl = asset.preview_url || asset.thumbnail_url || asset.url
    || asset.file_url || asset.download_url || asset.public_url
    || asset.original_url || asset.src || asset.href || asset.location
    || (asset.urls && (asset.urls.thumbnail || asset.urls.preview || asset.urls.original))
    || (asset.links && (asset.links.preview || asset.links.original || asset.links.self))
    || (asset.thumbnail && (asset.thumbnail.url || asset.thumbnail.href || asset.thumbnail))
    || asset.path
    || ''
  /* Until we know which field carries the URL on the live backend, log
     the unresolved shape to the console so we can see what's there. */
  if (!previewUrl && typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.warn('[AssetThumb] no URL found in asset payload, keys:', Object.keys(asset), asset)
  }
  const filename = asset.filename || asset.name || asset.original_name || ''
  const isImage = (asset.kind && ['logo', 'photo', 'headshot', 'banner', 'artwork', 'signage'].includes(asset.kind))
    || /\.(png|jpe?g|webp|gif|svg|avif)$/i.test(previewUrl || filename)
  /* Make the whole thumb clickable when we have a URL so the user can
     open the original in a new tab and verify it. */
  const Wrapper = ({ children }) => previewUrl
    ? <a href={previewUrl} target="_blank" rel="noreferrer" style={thumbWrapStyle}>{children}</a>
    : <div style={thumbWrapStyle}>{children}</div>

  return (
    <Wrapper>
      {onDelete && (
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (!deleting) onDelete() }}
          disabled={deleting}
          title={errored ? 'Delete failed, try again' : 'Delete asset'}
          aria-label="Delete asset"
          style={{
            position: 'absolute', top: 6, right: 6, zIndex: 2,
            width: 26, height: 26, borderRadius: 6,
            display: 'grid', placeItems: 'center',
            background: errored ? '#fee2e2' : 'rgba(255,255,255,0.92)',
            border: `1px solid ${errored ? '#fca5a5' : 'rgba(13,27,42,0.14)'}`,
            color: errored ? '#b91c1c' : '#0D1B2A',
            cursor: deleting ? 'not-allowed' : 'pointer',
            opacity: deleting ? 0.6 : 1,
          }}
        >
          {deleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
        </button>
      )}
      <div style={{
        aspectRatio: '4/3', borderRadius: 6, overflow: 'hidden',
        background: 'rgba(13,27,42,0.06)', display: 'grid', placeItems: 'center',
      }}>
        {isImage && previewUrl ? (
          <img src={previewUrl} alt={asset.alt_text || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
        ) : previewUrl ? (
          <FileText size={28} style={{ color: '#607186' }} />
        ) : (
          /* No URL resolved — surface the keys we received so the
             missing field name is immediately obvious in the UI. */
          <div style={{ padding: 8, textAlign: 'center', fontSize: 9, lineHeight: 1.35, color: '#b91c1c', fontFamily: 'IBM Plex Mono, monospace', overflow: 'hidden' }}>
            <p style={{ fontWeight: 700, marginBottom: 4 }}>No URL in payload</p>
            <p style={{ wordBreak: 'break-word' }}>{Object.keys(asset).slice(0, 8).join(', ')}</p>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between gap-2" style={{ fontSize: 11 }}>
        <span style={{ color: '#0D1B2A', textTransform: 'capitalize' }}>{asset.kind || 'file'}</span>
        {asset.featured && <span style={{ color: 'var(--event-primary)' }}><Star size={11} /></span>}
      </div>
      {filename && (
        <p title={filename} style={{ fontSize: 10.5, color: '#607186', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>
          {filename}
        </p>
      )}
    </Wrapper>
  )
}

const thumbWrapStyle = {
  border: '1px solid rgba(13,27,42,0.10)', borderRadius: 10, padding: 10,
  display: 'flex', flexDirection: 'column', gap: 8, background: '#FFFFFF',
  position: 'relative',
  textDecoration: 'none', color: 'inherit',
}

/* ─── Layout primitives ─────────────────────────────────────────────────── */

function FormCard({ title, subtitle, kicker, children }) {
  return (
    <section style={{
      background: '#FFFFFF', border: '1px solid rgba(13,27,42,0.08)', borderRadius: 14,
      padding: 'clamp(20px, 3vw, 32px)',
    }}>
      {kicker && <p className="miami-subhead" style={{ fontSize: 10, color: 'var(--event-secondary)', letterSpacing: '0.22em', marginBottom: 8 }}>{kicker}</p>}
      <h2 className="miami-headline" style={{ fontSize: '1.15rem', color: '#0D1B2A', marginBottom: subtitle ? 4 : 16 }}>{title}</h2>
      {subtitle && <p className="miami-body" style={{ fontSize: 13, color: '#3a4a5a', marginBottom: 18 }}>{subtitle}</p>}
      {children}
    </section>
  )
}

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      {label && <span className="font-mono" style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#607186' }}>{label}</span>}
      {children}
    </label>
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
    <div className="flex items-start gap-3 p-5 rounded-xl" style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.25)' }}>
      <AlertCircle size={20} style={{ color: '#b91c1c', flexShrink: 0 }} />
      <div>
        <p className="miami-headline" style={{ fontSize: 14, color: '#7c1d1d' }}>Could not load this profile</p>
        <p className="miami-body mt-1" style={{ fontSize: 13, color: '#7c1d1d' }}>{error?.message || 'Unknown error'}</p>
      </div>
    </div>
  )
}

/* ─── Form <-> API mapping ──────────────────────────────────────────────── */

function toFormState(profile) {
  return {
    display_name: profile.display_name || '',
    legal_name: profile.legal_name || '',
    email: profile.email || '',
    phone: profile.phone || '',
    website_url: profile.website_url || '',
    headline: profile.headline || '',
    bio: profile.bio || '',
    socials: profile.socials || {},
    links: Array.isArray(profile.links) ? profile.links : [],
    search_tags_input: Array.isArray(profile.search_tags) ? profile.search_tags.join(', ') : (profile.search_tags || ''),
    attributes: profile.attributes || {},
  }
}

function toApiPatch(form) {
  /* Strip empty social URLs so we don't store empty strings. */
  const socials = {}
  Object.entries(form.socials || {}).forEach(([k, v]) => { if (v && v.trim()) socials[k] = v.trim() })

  /* Drop link rows missing url. Preserve `category` and `note` so
     asset-category links (Shared asset links section) survive the
     round-trip alongside the public "Other links". */
  const links = (form.links || [])
    .map((row) => {
      const cleaned = {
        label: (row.label || '').trim(),
        url: (row.url || '').trim(),
      }
      if (row.category) cleaned.category = row.category
      if (row.note) cleaned.note = String(row.note).trim()
      return cleaned
    })
    .filter((row) => row.url)

  const search_tags = form.search_tags_input
    .split(/[,\n]/).map((t) => t.trim()).filter(Boolean)

  return {
    display_name: form.display_name,
    legal_name: form.legal_name,
    email: form.email,
    phone: form.phone,
    website_url: form.website_url,
    headline: form.headline,
    bio: form.bio,
    socials,
    links,
    search_tags,
  }
}

function prettyKey(key) {
  if (key === 'linkedin') return 'LinkedIn'
  if (key === 'youtube') return 'YouTube'
  if (key === 'tiktok') return 'TikTok'
  if (key === 'github') return 'GitHub'
  if (key === 'x') return 'X / Twitter'
  return key.charAt(0).toUpperCase() + key.slice(1)
}

const removeBtnStyle = {
  background: 'rgba(13,27,42,0.04)', border: '1px solid rgba(13,27,42,0.10)',
  borderRadius: 8, padding: '8px 10px', cursor: 'pointer', color: '#607186',
  marginBottom: 1,
}
