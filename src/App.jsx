import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Code-split every page so only the active route's JS is loaded
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const GlobalNetwork = lazy(() => import('./pages/GlobalNetwork'))
const Events = lazy(() => import('./pages/Events'))
const Contact = lazy(() => import('./pages/Contact'))
const SoccerexApp = lazy(() => import('./pages/SoccerexApp'))
const Gallery = lazy(() => import('./pages/Gallery'))
const Europe2026 = lazy(() => import('./pages/Europe2026'))
const PressRelease = lazy(() => import('./pages/PressRelease'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const TermsConditions = lazy(() => import('./pages/TermsConditions'))
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'))
const RefundPolicy = lazy(() => import('./pages/RefundPolicy'))

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
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/europe-2026" element={<Europe2026 />} />
          <Route path="/press/:slug" element={<PressRelease />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsConditions />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
        </Routes>
      </Suspense>
      <Footer />
    </BrowserRouter>
  )
}

export default App
