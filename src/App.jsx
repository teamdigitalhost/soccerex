import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Gallery from './pages/Gallery'
import Europe2026 from './pages/Europe2026'
import PressRelease from './pages/PressRelease'
import About from './pages/About'
import GlobalNetwork from './pages/GlobalNetwork'
import Events from './pages/Events'
import Contact from './pages/Contact'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsConditions from './pages/TermsConditions'
import CookiePolicy from './pages/CookiePolicy'
import RefundPolicy from './pages/RefundPolicy'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/global-network" element={<GlobalNetwork />} />
        <Route path="/events" element={<Events />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/europe-2026" element={<Europe2026 />} />
        <Route path="/press/:slug" element={<PressRelease />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsConditions />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
