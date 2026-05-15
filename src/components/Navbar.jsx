import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import {
  HOME, ABOUT, EVENTS, CONTACT, GLOBAL_NETWORK, INSIGHTS,
  MIAMI_2026, EUROPE_2026, RIYADH_2027, PROFILE_ACCESS, DEAL_NETWORK,
} from '../lib/routes'

const navLinks = [
  { label: 'About',        to: ABOUT },
  { label: 'Events',       to: EVENTS },
  { label: 'Network',      to: GLOBAL_NETWORK },
  { label: 'Deal Network', to: DEAL_NETWORK },
  { label: 'Insights',     to: INSIGHTS },
]

/* CTA accent color is route-aware so each event page's "Get in Touch" button
   matches its brand. Order matters — first prefix match wins. */
const CTA_THEMES = [
  { match: MIAMI_2026,  bg: '#E91E63', hover: '#c81b58', text: '#FFFFFF' },
  { match: EUROPE_2026, bg: '#c8302c', hover: '#a72824', text: '#FFFFFF' },
  { match: RIYADH_2027, bg: '#bfb170', hover: '#d4c78e', text: '#0D1B2A' },
]
const CTA_DEFAULT = { bg: 'var(--color-brand-accent)', hover: '#d4c78e', text: 'var(--color-navy, #0D1B2A)' }

function ctaThemeFor(pathname) {
  return CTA_THEMES.find((t) => pathname.startsWith(t.match)) || CTA_DEFAULT
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  /* Home navbar used to be transparent at the top of the dark hero,
     but the hero is now light/cream — a transparent navbar makes the
     white wordmark and nav links invisible against the cream and lets
     the hero crest overlap the top of the page. Keep the solid navy
     band on every route, every scroll position. */
  const solid = true
  const cta = ctaThemeFor(location.pathname)

  useEffect(() => {
    if (!location.state?.scrollTo) window.scrollTo(0, 0)
  }, [location.pathname, location.state])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  // Close menu on route change
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 transition-all duration-400" style={{
        background: solid ? 'rgba(9,32,62,0.97)' : 'transparent',
        backdropFilter: solid ? 'blur(20px)' : 'none',
        borderBottom: solid ? '1px solid rgba(191,177,112,0.15)' : '1px solid transparent',
      }}>
        <div className="flex items-center justify-between px-6" style={{ maxWidth: '1200px', margin: '0 auto', height: '72px' }}>
          <Link to={HOME} className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
            <img src="/logos/soccerex---logo-landscape-white.svg" alt="Soccerex" style={{ height: '28px', width: 'auto' }} />
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to}
                className="font-body font-semibold text-xs uppercase tracking-[0.15em] transition-colors duration-200 text-white/85 hover:text-white cursor-pointer whitespace-nowrap"
                style={{ textDecoration: 'none' }}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-5">
            {/* Low-emphasis self-service entry — speakers, delegates,
                rights-holders and company portals all go through here. */}
            <Link to={PROFILE_ACCESS}
              className="font-body font-medium text-xs uppercase tracking-[0.12em] transition-colors duration-200 whitespace-nowrap"
              style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.55)' }}>
              Sign in
            </Link>
            <Link to={CONTACT}
              className="inline-flex items-center gap-2 font-body font-semibold text-xs uppercase tracking-[0.12em] px-5 py-2.5 transition-all duration-300 cursor-pointer whitespace-nowrap"
              style={{ background: cta.bg, border: `1px solid ${cta.bg}`, color: cta.text, textDecoration: 'none' }}
              onMouseEnter={e => { e.currentTarget.style.background = cta.hover; e.currentTarget.style.borderColor = cta.hover }}
              onMouseLeave={e => { e.currentTarget.style.background = cta.bg; e.currentTarget.style.borderColor = cta.bg }}
            >
              Get in Touch
            </Link>
          </div>

          <button onClick={() => setMenuOpen(true)} className="lg:hidden w-11 h-11 flex items-center justify-center text-white bg-transparent border-none cursor-pointer" aria-label="Open menu">
            <Menu size={22} />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div className={`nav-mobile-overlay ${menuOpen ? 'nav-mobile-open' : ''}`} style={{ background: '#09203e' }}>
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid rgba(191,177,112,0.2)' }}>
          <img src="/logos/soccerex---logo-landscape-white.svg" alt="Soccerex" style={{ height: '28px', width: 'auto' }} />
          <button onClick={() => setMenuOpen(false)} className="w-11 h-11 flex items-center justify-center text-white bg-transparent border-none cursor-pointer" aria-label="Close menu">
            <X size={22} />
          </button>
        </div>
        <div className="flex-1 flex flex-col items-start justify-center gap-1 px-8">
          {navLinks.map((link, i) => (
            <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)}
              className="nav-mobile-link font-heading font-bold text-white py-3 uppercase tracking-[0.05em] hover:text-brand-accent transition-colors cursor-pointer text-left"
              style={{ fontSize: 'clamp(2rem, 7vw, 3.5rem)', textDecoration: 'none', display: 'block', transitionDelay: menuOpen ? `${150 + i * 80}ms` : '0ms' }}>
              {link.label}
            </Link>
          ))}
          <Link to={CONTACT} onClick={() => setMenuOpen(false)}
            className="nav-mobile-link inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] px-8 py-4 mt-6 cursor-pointer border-none"
            style={{ background: cta.bg, color: cta.text, textDecoration: 'none', transitionDelay: menuOpen ? `${150 + navLinks.length * 80}ms` : '0ms' }}>
            Get in Touch
          </Link>
          <Link to={PROFILE_ACCESS} onClick={() => setMenuOpen(false)}
            className="nav-mobile-link font-mono uppercase tracking-[0.2em] mt-4 cursor-pointer"
            style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.7rem', textDecoration: 'none', transitionDelay: menuOpen ? `${150 + (navLinks.length + 1) * 80}ms` : '0ms' }}>
            Sign in
          </Link>
        </div>
      </div>
    </>
  )
}
