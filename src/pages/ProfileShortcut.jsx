import { Navigate, useParams } from 'react-router-dom'
import { readProfileAccessSession } from '../lib/profileAccessAuth'
import { PROFILE_ACCESS, companyPortal, personalPortal } from '../lib/routes'

/*
 * soccerex.com/profile and soccerex.com/profile/:slug — the addresses people
 * can remember and the short link we print in Deal Network emails.
 *
 * Signed out: forward to /profile-access (the email sign-in form).
 * /profile/:slug signed in: straight into that profile's portal when the
 * session covers it, otherwise the chooser.
 * /profile with one profile: straight into its portal; several: the chooser.
 */
export default function ProfileShortcut() {
  const { slug } = useParams()
  const session = readProfileAccessSession()

  if (!session?.edit_token) return <Navigate to={PROFILE_ACCESS} replace />

  const profiles = Array.isArray(session.profiles) ? session.profiles : []
  const target = slug
    ? profiles.find((p) => p?.slug === slug)
    : (profiles.length === 1 ? profiles[0] : null)

  if (target?.slug) {
    /* Same mapping as the chooser card: companies get the sponsor portal,
       everyone else the unified personal portal. */
    const isCompany = target?.profile_kind === 'company' || target?.is_company === true
    return <Navigate to={isCompany ? companyPortal(target.slug) : personalPortal(target.slug)} replace />
  }

  return <Navigate to={PROFILE_ACCESS} replace />
}
