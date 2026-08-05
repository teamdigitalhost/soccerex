import { Navigate } from 'react-router-dom'
import { readProfileAccessSession } from '../lib/profileAccessAuth'
import { PROFILE_ACCESS, companyPortal, personalPortal } from '../lib/routes'

/*
 * soccerex.com/profile — the address people can remember.
 *
 * Signed out: forward to /profile-access (the email sign-in form).
 * One profile: straight into that profile's portal.
 * Several profiles: /profile-access, which shows the chooser for a
 * signed-in session.
 */
export default function ProfileShortcut() {
  const session = readProfileAccessSession()

  if (!session?.edit_token) return <Navigate to={PROFILE_ACCESS} replace />

  const profiles = Array.isArray(session.profiles) ? session.profiles : []
  if (profiles.length === 1 && profiles[0]?.slug) {
    const p = profiles[0]
    /* Same mapping as the chooser card: companies get the sponsor portal,
       everyone else the unified personal portal. */
    const isCompany = p?.profile_kind === 'company' || p?.is_company === true
    return <Navigate to={isCompany ? companyPortal(p.slug) : personalPortal(p.slug)} replace />
  }

  return <Navigate to={PROFILE_ACCESS} replace />
}
