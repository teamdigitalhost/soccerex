import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ThemePicker from './components/ThemePicker'
import TestModeBanner from './components/TestModeBanner'
import {
  HOME, ABOUT, EVENTS, CONTACT, GLOBAL_NETWORK, GALLERY, APP_PAGE,
  MIAMI_2026, EUROPE_2026, RIYADH_2027,
  INSIGHTS, PROFILE_ACCESS, DEAL_NETWORK,
  PRIVACY_POLICY, TERMS, COOKIE_POLICY, REFUND_POLICY,
  ROUTE_PATTERNS,
} from './lib/routes'

// Code-split every page so only the active route's JS is loaded
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const GlobalNetwork = lazy(() => import('./pages/GlobalNetwork'))
const Events = lazy(() => import('./pages/Events'))
const Contact = lazy(() => import('./pages/Contact'))
const Gallery = lazy(() => import('./pages/Gallery'))
const Europe2026 = lazy(() => import('./pages/Europe2026'))
const Miami2026 = lazy(() => import('./pages/Miami2026'))
const Riyadh2027 = lazy(() => import('./pages/Riyadh2027'))
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
const CompanyPortal = lazy(() => import('./pages/CompanyPortal'))
const PersonalPortal = lazy(() => import('./pages/PersonalPortal'))
const DealNetworkPage = lazy(() => import('./pages/DealNetwork'))
// SoccerExpert page retired — subscribe form on /insights#soccerexpert-subscribe
// Unreleased verticals (HerSoccerex, The Pitch) kept on disk but
// no longer routed until announced. Restore routes in App.jsx when launching.

function App() {
  return (
    <BrowserRouter>
      <TestModeBanner />
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
          <Route path={EUROPE_2026} element={<Europe2026 />} />
          <Route path={MIAMI_2026} element={<Miami2026 />} />
          <Route path={RIYADH_2027} element={<Riyadh2027 />} />
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
          {/* Profile self-service editor (passwordless via emailed link) */}
          <Route path={PROFILE_ACCESS} element={<ProfileAccess />} />
          <Route path={ROUTE_PATTERNS.profileEditor} element={<ProfileEditor />} />
          <Route path={ROUTE_PATTERNS.companyPortal} element={<CompanyPortal />} />
          <Route path={ROUTE_PATTERNS.personalPortal} element={<PersonalPortal />} />
        </Routes>
      </Suspense>
      <Footer />
      <ThemePicker />
    </BrowserRouter>
  )
}

export default App
