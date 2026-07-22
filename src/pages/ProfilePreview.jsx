import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Loader2, AlertCircle, ShieldCheck } from 'lucide-react'
import { getProfilePreview, ApiError } from '../lib/soccerexApi'
import { ProfileCard } from './ProfileView'

/* Admin-only, signed, expiring preview of a profile WITH a pending revision overlaid,
   rendered with the exact same public card the profile-access view uses, and no email
   gate. Links here are minted from the admin Profile Revisions surface only; the
   signature params are forwarded verbatim to the signed API route, which is the sole
   authority (a missing/expired/tampered signature is a 403, and this page just shows
   the error). Not indexed, not linked from anywhere public. */

export default function ProfilePreview() {
  const { revisionId } = useParams()
  const [params] = useSearchParams()
  const [state, setState] = useState({ profile: null, error: null })

  const expires = params.get('expires')
  const signature = params.get('signature')

  /* Keep crawlers out even if a link leaks: signed URLs expire in an hour anyway. */
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    return () => { document.head.removeChild(meta) }
  }, [])

  useEffect(() => {
    if (!expires || !signature) {
      setState({ profile: null, error: new Error('This preview link is incomplete.') })
      return
    }
    let cancelled = false
    getProfilePreview(revisionId, { expires, signature })
      .then((data) => { if (!cancelled) setState({ profile: data, error: null }) })
      .catch((err) => { if (!cancelled) setState({ profile: null, error: err }) })
    return () => { cancelled = true }
  }, [revisionId, expires, signature])

  const { profile, error } = state
  const isCompany = profile?.profile_kind
    ? profile.profile_kind === 'company'
    : !!profile?.is_company

  return (
    <div className="event-page theme-soccerex" style={{ background: '#FAFBFC', minHeight: '100vh', paddingTop: 'var(--app-top-offset)' }}>
      <div style={{
        background: '#FFF7E6', borderBottom: '1px solid rgba(180,120,10,0.25)',
        padding: '10px clamp(24px,5vw,60px)',
      }}>
        <div className="flex items-center gap-2 flex-wrap" style={{ maxWidth: 760, margin: '0 auto', fontSize: 12.5, color: '#7A4E0B' }}>
          <ShieldCheck size={14} />
          <strong>Admin preview</strong>
          <span>
            {profile?.preview?.revision_status
              ? `pending revision #${profile.preview.revision_id} overlaid (${(profile.preview.changed_fields || []).length} field${(profile.preview.changed_fields || []).length === 1 ? '' : 's'} changed)`
              : 'signed link, expires within the hour'}
          </span>
          <span style={{ opacity: 0.7 }}>· not visible to the public · approve or reject in the admin</span>
        </div>
      </div>

      <section style={{ padding: 'clamp(24px,3vw,40px) clamp(24px,5vw,60px) clamp(80px,10vw,120px)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          {error && (
            <div className="flex items-start gap-3" style={{
              background: '#FDF0EF', border: '1px solid rgba(160,40,30,0.25)', borderRadius: 12,
              padding: '16px 18px', color: '#8A2C23', fontSize: 14,
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <p style={{ fontWeight: 600, marginBottom: 2 }}>Preview unavailable</p>
                <p>
                  {error instanceof ApiError && error.status === 403
                    ? 'This preview link has expired or is invalid. Open a fresh one from the Profile Revisions list in the admin.'
                    : (error.message || 'Something went wrong loading the preview.')}
                </p>
              </div>
            </div>
          )}
          {!error && !profile && (
            <div className="flex items-center gap-2" style={{ color: '#0D1B2A', opacity: 0.6, fontSize: 14 }}>
              <Loader2 size={16} className="animate-spin" /> Loading preview
            </div>
          )}
          {profile && <ProfileCard profile={profile} isCompany={isCompany} />}
        </div>
      </section>
    </div>
  )
}
