import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ThemePicker from './components/ThemePicker'

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
// SoccerExpert page retired — subscribe form on /insights#soccerexpert-subscribe
// Unreleased verticals (Deal Network, HerSoccerex, The Pitch) kept on disk but
// no longer routed until announced. Restore routes in App.jsx when launching.

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Suspense fallback={<div style={{ minHeight: '100vh', background: '#050d1a' }} />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/global-network" element={<GlobalNetwork />} />
          <Route path="/events" element={<Events />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/app" element={<SoccerexApp />} />
          <Route path="/insights" element={<InsightsList />} />
          <Route path="/insights/:slug" element={<InsightArticle />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/europe-2026" element={<Europe2026 />} />
          <Route path="/miami-2026" element={<Miami2026 />} />
          <Route path="/riyadh-2027" element={<Riyadh2027 />} />
          <Route path="/press/:slug" element={<PressRelease />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsConditions />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          {/* API-driven public programming pages (per-event) */}
          <Route path="/events/:slug/agenda-concept" element={<EventAgendaConcept />} />
          <Route path="/events/:slug/topics" element={<EventAgendaConcept />} />
          <Route path="/events/:slug/agenda" element={<EventAgenda />} />
          <Route path="/events/:slug/schedule" element={<EventAgenda />} />
          <Route path="/events/:slug/speakers" element={<EventSpeakers />} />
        </Routes>
      </Suspense>
      <Footer />
      <ThemePicker />
    </BrowserRouter>
  )
}

export default App
