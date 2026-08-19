import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ThemePicker from './components/ThemePicker'
import TestModeBanner from './components/TestModeBanner'
import CookieBanner from './components/CookieBanner'
import { trackPageView } from './lib/soccerexApi'
import { getConsent, loadAnalytics } from './lib/analytics'
import {
  HOME, ABOUT, EVENTS, CONTACT, GLOBAL_NETWORK, GALLERY, PAST_SPEAKERS, APP_PAGE,
  MIAMI_2026, MIAMI_2026_PRESS_RELEASE, MIAMI_2026_PRICING, MIAMI_2026_PRICING_CATEGORY, MIAMI_2026_SPONSOR, MIAMI_2026_EXHIBIT, MIAMI_2026_ACCOMMODATIONS, MIAMI_2026_ACCOMMODATIONS_MISSPELLED, ACCOMMODATIONS, ACCOMMODATIONS_MISSPELLED, BOOK, SPONSOR, EXHIBIT, EXHIBITOR, SPONSORSHIP, EUROPE_2026, RIYADH_2027,
  EVENT_RECAP_PATTERN,
  INSIGHTS, PROFILE_ACCESS, PROFILE_SHORTCUT, DEAL_NETWORK, RITZ_DRAWING, CTA_PATTERN, AGENDA_COLLAB,
  INVITE_PATTERN,
  SCHEDULE_CALL_PATTERN,
  PRIVACY_POLICY, TERMS, COOKIE_POLICY, REFUND_POLICY,
  ROUTE_PATTERNS,
} from './lib/routes'

/* Map pathname to a theme class. Applied at app root so the navbar
   and footer (which sit outside the page component) pick up the
   event's --color-brand-accent override. Non-event routes get no class and
   fall through to the base brand color defined in :root. */
function themeClassFor(pathname) {
  if (!pathname) return ''
  if (pathname.startsWith(MIAMI_2026)) return 'theme-miami'
  // Evergreen sponsor/exhibit pages currently wear the Miami skin (per brand
  // direction); keep navbar + footer accent consistent with the page.
  if (pathname === SPONSOR || pathname === EXHIBIT || pathname === ACCOMMODATIONS || pathname === RITZ_DRAWING) return 'theme-miami'
  if (pathname.startsWith(EUROPE_2026)) return 'theme-europe'
  if (pathname.startsWith(RIYADH_2027)) return 'theme-riyadh'
  return ''
}

function AppShell({ children }) {
  const location = useLocation()
  const themeClass = themeClassFor(location.pathname)
  return <div className={themeClass}>{children}</div>
}

/* Fires a fire-and-forget page-view beacon on every route change. Carries the
   pricing-unlock email (if present) so views can be tied to a known lead. */
function PageViewTracker() {
  const location = useLocation()
  useEffect(() => {
    let sid = null
    try {
      sid = sessionStorage.getItem('sx_sid')
      if (!sid) { sid = 's-' + Math.random().toString(36).slice(2, 12) + Date.now().toString(36); sessionStorage.setItem('sx_sid', sid) }
    } catch { /* ignore */ }
    let email = null
    try { email = localStorage.getItem('sx_pricing_email') || null } catch { /* ignore */ }
    const qs = new URLSearchParams(location.search)
    /* Identity handed over by an email click (?sx=<opaque per-send token>). Persist it so every
       later page view and form submit from this browser stays tied to the lead who clicked, not
       only the first landing. Without it the visit reads as organic traffic and the conversion can
       never be credited back to the campaign that produced it. */
    let clickToken = null
    try {
      const fromUrl = qs.get('sx')
      if (fromUrl) localStorage.setItem('sx_click_token', fromUrl)
      clickToken = fromUrl || localStorage.getItem('sx_click_token') || null
    } catch { /* ignore */ }
    trackPageView({
      session_id: sid,
      path: location.pathname,
      title: typeof document !== 'undefined' ? document.title : null,
      referrer: typeof document !== 'undefined' ? (document.referrer || null) : null,
      email,
      sx: clickToken,
      utm_source: qs.get('utm_source'),
      utm_medium: qs.get('utm_medium'),
      utm_campaign: qs.get('utm_campaign'),
    })
  }, [location.pathname])
  return null
}

// Code-split every page so only the active route's JS is loaded
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const GlobalNetwork = lazy(() => import('./pages/GlobalNetwork'))
const Events = lazy(() => import('./pages/Events'))
const Contact = lazy(() => import('./pages/Contact'))
const Gallery = lazy(() => import('./pages/Gallery'))
const PastSpeakers = lazy(() => import('./pages/PastSpeakers'))
const Europe2026 = lazy(() => import('./pages/Europe2026'))
const Miami2026 = lazy(() => import('./pages/Miami2026'))
const MiamiPressRelease = lazy(() => import('./pages/MiamiPressRelease'))
const MiamiAccommodations = lazy(() => import('./pages/MiamiAccommodations'))
const Sponsor = lazy(() => import('./pages/Sponsor'))
const Exhibit = lazy(() => import('./pages/Exhibit'))
const PressRelease = lazy(() => import('./pages/PressRelease'))
const SoccerexApp = lazy(() => import('./pages/SoccerexApp'))
const InsightsList = lazy(() => import('./pages/InsightsList'))
const InsightArticle = lazy(() => import('./pages/InsightArticle'))
const EventRecap = lazy(() => import('./pages/EventRecap'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const TermsConditions = lazy(() => import('./pages/TermsConditions'))
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'))
const RefundPolicy = lazy(() => import('./pages/RefundPolicy'))
const EventAgendaConcept = lazy(() => import('./pages/EventAgendaConcept'))
const EventAgenda = lazy(() => import('./pages/EventAgenda'))
const EventSpeakers = lazy(() => import('./pages/EventSpeakers'))
const EventSpeakerProfile = lazy(() => import('./pages/EventSpeakerProfile'))
const ProfileAccess = lazy(() => import('./pages/ProfileAccess'))
const ProfileShortcut = lazy(() => import('./pages/ProfileShortcut'))
const SpeakerRespond = lazy(() => import('./pages/SpeakerRespond'))
const ProfileEditor = lazy(() => import('./pages/ProfileEditor'))
const ProfileView = lazy(() => import('./pages/ProfileView'))
const ProfilePreview = lazy(() => import('./pages/ProfilePreview'))
const ArticlePreview = lazy(() => import('./pages/ArticlePreview'))
const CompanyPortal = lazy(() => import('./pages/CompanyPortal'))
const PersonalPortal = lazy(() => import('./pages/PersonalPortal'))
const DealNetworkPage = lazy(() => import('./pages/DealNetwork'))
const InviteAccept = lazy(() => import('./pages/InviteAccept'))
const DealNetworkApply = lazy(() => import('./pages/DealNetworkApply'))
const RitzDrawingTerms = lazy(() => import('./pages/RitzDrawingTerms'))
const CtaLanding = lazy(() => import('./pages/CtaLanding'))
const AgendaCollab = lazy(() => import('./pages/AgendaCollab'))
const ScheduleCall = lazy(() => import('./pages/ScheduleCall'))
// SoccerExpert page retired — subscribe form on /insights#soccerexpert-subscribe
// Unreleased verticals (HerSoccerex, The Pitch) kept on disk but
// no longer routed until announced. Restore routes in App.jsx when launching.

function App() {
  useEffect(() => {
    if (getConsent() === 'accepted') loadAnalytics()
  }, [])

  return (
    <BrowserRouter>
      <TestModeBanner />
      <CookieBanner />
      <PageViewTracker />
      <AppShell>
      <Navbar />
      <Suspense fallback={<div style={{ minHeight: '100vh', background: '#050d1a' }} />}>
        <Routes>
          <Route path={HOME} element={<Home />} />
          <Route path={ABOUT} element={<About />} />
          <Route path={GLOBAL_NETWORK} element={<GlobalNetwork />} />
          <Route path={EVENTS} element={<Events />} />
          <Route path={CONTACT} element={<Contact />} />
          <Route path={DEAL_NETWORK} element={<DealNetworkPage />} />
          <Route path={APP_PAGE} element={<SoccerexApp />} />
          <Route path={INSIGHTS} element={<InsightsList />} />
          <Route path={ROUTE_PATTERNS.insightArticle} element={<InsightArticle />} />
          <Route path={GALLERY} element={<Gallery />} />
          <Route path={PAST_SPEAKERS} element={<PastSpeakers />} />
          <Route path={EUROPE_2026} element={<Europe2026 />} />
          <Route path={MIAMI_2026} element={<Miami2026 />} />
          {/* Prices page removed entirely (Joel, 2026-08-03). Old links redirect:
              campaign emails carried magic links into the pricing gate, so these
              paths must land somewhere real, not 404. Delegate prices live on
              Eventify; the Miami page carries every remaining CTA. */}
          <Route path={MIAMI_2026_PRICING} element={<Navigate to={MIAMI_2026} replace />} />
          <Route path={MIAMI_2026_PRICING_CATEGORY} element={<Navigate to={MIAMI_2026} replace />} />
          <Route path={MIAMI_2026_PRESS_RELEASE} element={<MiamiPressRelease />} />
          <Route path={ACCOMMODATIONS} element={<MiamiAccommodations />} />
          <Route path={ACCOMMODATIONS_MISSPELLED} element={<Navigate to={ACCOMMODATIONS} replace />} />
          <Route path={BOOK} element={<Navigate to={ACCOMMODATIONS} replace />} />
          {/* Legacy Miami-scoped accommodations URLs redirect to the evergreen page */}
          <Route path={MIAMI_2026_ACCOMMODATIONS} element={<Navigate to={ACCOMMODATIONS} replace />} />
          <Route path={MIAMI_2026_ACCOMMODATIONS_MISSPELLED} element={<Navigate to={ACCOMMODATIONS} replace />} />
          {/* Evergreen platform-level sponsor + exhibit pages */}
          <Route path={SPONSOR} element={<Sponsor />} />
          <Route path={EXHIBIT} element={<Exhibit />} />
          {/* Legacy Miami-scoped URLs redirect to the evergreen pages */}
          <Route path={MIAMI_2026_SPONSOR} element={<Navigate to={SPONSOR} replace />} />
          <Route path={MIAMI_2026_EXHIBIT} element={<Navigate to={EXHIBIT} replace />} />
          {/* Natural-language aliases used in outreach copy and decks. Without these the
              catch-all sent them to /events, losing the lead's actual intent. */}
          <Route path={EXHIBITOR} element={<Navigate to={EXHIBIT} replace />} />
          <Route path={SPONSORSHIP} element={<Navigate to={SPONSOR} replace />} />
          {/* Riyadh inner page is paused: redirect to the events list until the
              event details (venue, dates) are confirmed. Page kept on disk. */}
          <Route path={RIYADH_2027} element={<Navigate to={EVENTS} replace />} />
          <Route path={ROUTE_PATTERNS.pressRelease} element={<PressRelease />} />
          <Route path={PRIVACY_POLICY} element={<PrivacyPolicy />} />
          <Route path={TERMS} element={<TermsConditions />} />
          <Route path={COOKIE_POLICY} element={<CookiePolicy />} />
          <Route path={REFUND_POLICY} element={<RefundPolicy />} />
          {/* API-driven public programming pages (per-event) */}
          <Route path={ROUTE_PATTERNS.eventAgendaConcept} element={<EventAgendaConcept />} />
          <Route path={ROUTE_PATTERNS.eventTopics} element={<EventAgendaConcept />} />
          <Route path={ROUTE_PATTERNS.eventAgenda} element={<EventAgenda />} />
          <Route path={ROUTE_PATTERNS.eventSchedule} element={<EventAgenda />} />
          <Route path={ROUTE_PATTERNS.eventSpeakers} element={<EventSpeakers />} />
          <Route path={ROUTE_PATTERNS.eventSpeaker} element={<EventSpeakerProfile />} />
          {/* Invitation accept (admin issues invite_token, link lands here) */}
          <Route path={INVITE_PATTERN} element={<InviteAccept />} />
          <Route path={SCHEDULE_CALL_PATTERN} element={<ScheduleCall />} />
          {/* Deal Network unlisted apply flow (email-first + profile match) */}
          <Route path="/deal-network/apply" element={<DealNetworkApply />} />
          {/* Official terms for the Ritz-Carlton drawing (invite-email incentive) */}
          <Route path={RITZ_DRAWING} element={<RitzDrawingTerms />} />
          {/* CTA landing pages: the URL email buttons link to (popup-as-a-page) */}
          <Route path={CTA_PATTERN} element={<CtaLanding />} />
          {/* External agenda-collaborator review (personal ?token= link) */}
          <Route path={AGENDA_COLLAB} element={<AgendaCollab />} />
          {/* Speaker casting response page (personal ?token= link from invite +
              follow-up emails). Unrouted until now: every emailed /speak link
              fell through the catch-all to /events with the token discarded. */}
          <Route path="/speak" element={<SpeakerRespond />} />
          {/* Profile self-service editor (passwordless via emailed link) */}
          <Route path={PROFILE_ACCESS} element={<ProfileAccess />} />
          <Route path={PROFILE_SHORTCUT} element={<ProfileShortcut />} />
          <Route path={`${PROFILE_SHORTCUT}/:slug`} element={<ProfileShortcut />} />
          <Route path={ROUTE_PATTERNS.profileEditor} element={<ProfileEditor />} />
          <Route path={ROUTE_PATTERNS.profileView} element={<ProfileView />} />
          <Route path={ROUTE_PATTERNS.profilePreview} element={<ProfilePreview />} />
          <Route path={ROUTE_PATTERNS.articlePreview} element={<ArticlePreview />} />
          <Route path={ROUTE_PATTERNS.companyPortal} element={<CompanyPortal />} />
          <Route path={ROUTE_PATTERNS.personalPortal} element={<PersonalPortal />} />
          {/* Past-event recap pages: /miami-2025, etc. Renders from the RECENT data;
              an unknown slug redirects to /events (never blank). */}
          <Route path={EVENT_RECAP_PATTERN} element={<EventRecap />} />
          {/* Safety net so any other unknown path lands on /events instead of blank. */}
          <Route path="*" element={<Navigate to={EVENTS} replace />} />
        </Routes>
      </Suspense>
      <Footer />
      </AppShell>
      <ThemePicker />
    </BrowserRouter>
  )
}

export default App
