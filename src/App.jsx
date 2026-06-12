import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ThemePicker from './components/ThemePicker'
import TestModeBanner from './components/TestModeBanner'
import { trackPageView } from './lib/soccerexApi'
import {
  HOME, ABOUT, EVENTS, CONTACT, GLOBAL_NETWORK, GALLERY, PAST_SPEAKERS, APP_PAGE,
  MIAMI_2026, MIAMI_2026_PRESS_RELEASE, MIAMI_2026_PRICING, MIAMI_2026_PRICING_CATEGORY, EUROPE_2026, RIYADH_2027,
  INSIGHTS, PROFILE_ACCESS, DEAL_NETWORK, AGENDA_COLLAB,
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
    trackPageView({
      session_id: sid,
      path: location.pathname,
      title: typeof document !== 'undefined' ? document.title : null,
      referrer: typeof document !== 'undefined' ? (document.referrer || null) : null,
      email,
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
const MiamiPricing = lazy(() => import('./pages/MiamiPricing'))
const PricingChooser = lazy(() => import('./pages/PricingChooser'))
const PressRelease = lazy(() => import('./pages/PressRelease'))
const SoccerexApp = lazy(() => import('./pages/SoccerexApp'))
const InsightsList = lazy(() => import('./pages/InsightsList'))
const InsightArticle = lazy(() => import('./pages/InsightArticle'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const TermsConditions = lazy(() => import('./pages/TermsConditions'))
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'))
const RefundPolicy = lazy(() => import('./pages/RefundPolicy'))
const EventAgendaConcept = lazy(() => import('./pages/EventAgendaConcept'))
const EventAgenda = lazy(() => import('./pages/EventAgenda'))
const EventSpeakers = lazy(() => import('./pages/EventSpeakers'))
const EventSpeakerProfile = lazy(() => import('./pages/EventSpeakerProfile'))
const ProfileAccess = lazy(() => import('./pages/ProfileAccess'))
const ProfileEditor = lazy(() => import('./pages/ProfileEditor'))
const ProfileView = lazy(() => import('./pages/ProfileView'))
const CompanyPortal = lazy(() => import('./pages/CompanyPortal'))
const PersonalPortal = lazy(() => import('./pages/PersonalPortal'))
const DealNetworkPage = lazy(() => import('./pages/DealNetwork'))
const InviteAccept = lazy(() => import('./pages/InviteAccept'))
const DealNetworkApply = lazy(() => import('./pages/DealNetworkApply'))
const AgendaCollab = lazy(() => import('./pages/AgendaCollab'))
const ScheduleCall = lazy(() => import('./pages/ScheduleCall'))
// SoccerExpert page retired — subscribe form on /insights#soccerexpert-subscribe
// Unreleased verticals (HerSoccerex, The Pitch) kept on disk but
// no longer routed until announced. Restore routes in App.jsx when launching.

function App() {
  return (
    <BrowserRouter>
      <TestModeBanner />
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
          <Route path={MIAMI_2026_PRICING} element={<PricingChooser />} />
          <Route path={MIAMI_2026_PRICING_CATEGORY} element={<MiamiPricing />} />
          <Route path={MIAMI_2026_PRESS_RELEASE} element={<MiamiPressRelease />} />
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
          {/* External agenda-collaborator review (personal ?token= link) */}
          <Route path={AGENDA_COLLAB} element={<AgendaCollab />} />
          {/* Profile self-service editor (passwordless via emailed link) */}
          <Route path={PROFILE_ACCESS} element={<ProfileAccess />} />
          <Route path={ROUTE_PATTERNS.profileEditor} element={<ProfileEditor />} />
          <Route path={ROUTE_PATTERNS.profileView} element={<ProfileView />} />
          <Route path={ROUTE_PATTERNS.companyPortal} element={<CompanyPortal />} />
          <Route path={ROUTE_PATTERNS.personalPortal} element={<PersonalPortal />} />
        </Routes>
      </Suspense>
      <Footer />
      </AppShell>
      <ThemePicker />
    </BrowserRouter>
  )
}

export default App
