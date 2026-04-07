import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, ChevronDown } from 'lucide-react'

const navLinks = [
  { label: 'Events', to: '/events' },
  { label: 'About', to: '/about' },
  {
    label: 'Platform',
    dropdown: [
      { label: 'Deal Network', to: '/deal-network', desc: 'Structured dealmaking, not just networking.' },
      { label: 'HerSoccerex', to: '/hersoccerex', desc: 'Women\'s football business vertical.' },
      { label: 'The Pitch', to: '/the-pitch', desc: 'Football innovation meets institutional capital.' },
    ],
  },
  { label: 'Insights', to: '/insights' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState(false)
  const dropdownRef = useRef(null)
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
      setMobileExpanded(false)
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  // Close dropdown on route change
  useEffect(() => {
    setDropdownOpen(false)
    setMenuOpen(false)
  }, [location.pathname])

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

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              link.dropdown ? (
                <div key={link.label} ref={dropdownRef} className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="inline-flex items-center gap-1.5 font-body font-semibold text-xs uppercase tracking-[0.15em] transition-colors duration-200 text-white/85 hover:text-white cursor-pointer whitespace-nowrap bg-transparent border-none"
                  >
                    {link.label}
                    <ChevronDown size={13} style={{ transition: 'transform 0.2s', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
                  </button>
                  {/* Dropdown */}
                  <div className="nav-dropdown" style={{
                    position: 'absolute', top: '100%', left: '50%',
                    paddingTop: '12px',
                    opacity: dropdownOpen ? 1 : 0,
                    transform: `translateX(-50%) translateY(${dropdownOpen ? '0' : '-8px'})`,
                    pointerEvents: dropdownOpen ? 'auto' : 'none',
                    transition: 'opacity 0.25s, transform 0.25s',
                  }}>
                    <div style={{
                      background: 'rgba(9,32,62,0.98)', backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(191,177,112,0.2)',
                      borderRadius: '12px', padding: '8px', minWidth: '280px',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                    }}>
                      {link.dropdown.map((item) => (
                        <Link key={item.to} to={item.to}
                          className="block rounded-lg transition-all duration-200"
                          style={{ padding: '14px 16px', textDecoration: 'none' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(191,177,112,0.1)' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                        >
                          <p className="font-body font-semibold text-white" style={{ fontSize: '0.88rem', marginBottom: '3px' }}>{item.label}</p>
                          <p className="font-body text-white/50" style={{ fontSize: '0.75rem', lineHeight: 1.4 }}>{item.desc}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link key={link.to} to={link.to}
                  className="font-body font-semibold text-xs uppercase tracking-[0.15em] transition-colors duration-200 text-white/85 hover:text-white cursor-pointer whitespace-nowrap"
                  style={{ textDecoration: 'none' }}>
                  {link.label}
                </Link>
              )
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
            link.dropdown ? (
              <div key={link.label} style={{ width: '100%' }}>
                <button
                  onClick={() => setMobileExpanded(!mobileExpanded)}
                  className="nav-mobile-link font-heading font-bold text-white py-3 uppercase tracking-[0.05em] hover:text-gold transition-colors cursor-pointer text-left bg-transparent border-none w-full inline-flex items-center gap-3"
                  style={{ fontSize: 'clamp(2rem, 7vw, 3.5rem)', transitionDelay: menuOpen ? `${150 + i * 80}ms` : '0ms' }}
                >
                  {link.label}
                  <ChevronDown size={24} style={{ transition: 'transform 0.2s', transform: mobileExpanded ? 'rotate(180deg)' : 'rotate(0)', color: '#bfb170' }} />
                </button>
                {mobileExpanded && (
                  <div style={{ paddingLeft: '16px', paddingBottom: '12px' }}>
                    {link.dropdown.map((item) => (
                      <Link key={item.to} to={item.to} onClick={() => setMenuOpen(false)}
                        className="block font-heading font-semibold text-white/70 py-2 hover:text-gold transition-colors"
                        style={{ fontSize: 'clamp(1.1rem, 4vw, 1.6rem)', textDecoration: 'none' }}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)}
                className="nav-mobile-link font-heading font-bold text-white py-3 uppercase tracking-[0.05em] hover:text-gold transition-colors cursor-pointer text-left"
                style={{ fontSize: 'clamp(2rem, 7vw, 3.5rem)', textDecoration: 'none', display: 'block', transitionDelay: menuOpen ? `${150 + i * 80}ms` : '0ms' }}>
                {link.label}
              </Link>
            )
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
