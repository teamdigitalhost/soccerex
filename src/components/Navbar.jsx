import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'About', to: '/about' },
  { label: 'Events', to: '/events' },
  { label: 'Network', to: '/global-network' },
  { label: 'Insights', to: '/insights' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'
  const solid = scrolled || !isHome

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => { setScrolled(window.scrollY > 80); ticking = false })
        ticking = true
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
          <Link to="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
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

          <Link to="/contact"
            className="hidden lg:inline-flex items-center gap-2 text-navy font-body font-semibold text-xs uppercase tracking-[0.12em] px-5 py-2.5 transition-all duration-300 cursor-pointer whitespace-nowrap"
            style={{ background: '#bfb170', border: '1px solid #bfb170', textDecoration: 'none' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#d4c78e'; e.currentTarget.style.borderColor = '#d4c78e' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#bfb170'; e.currentTarget.style.borderColor = '#bfb170' }}
          >
            Get in Touch
          </Link>

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
              className="nav-mobile-link font-heading font-bold text-white py-3 uppercase tracking-[0.05em] hover:text-gold transition-colors cursor-pointer text-left"
              style={{ fontSize: 'clamp(2rem, 7vw, 3.5rem)', textDecoration: 'none', display: 'block', transitionDelay: menuOpen ? `${150 + i * 80}ms` : '0ms' }}>
              {link.label}
            </Link>
          ))}
          <Link to="/contact" onClick={() => setMenuOpen(false)}
            className="nav-mobile-link inline-flex items-center gap-2 text-navy font-mono text-xs uppercase tracking-[0.2em] px-8 py-4 mt-6 cursor-pointer border-none"
            style={{ background: '#bfb170', textDecoration: 'none', transitionDelay: menuOpen ? `${150 + navLinks.length * 80}ms` : '0ms' }}>
            Get in Touch
          </Link>
        </div>
      </div>
    </>
  )
}
