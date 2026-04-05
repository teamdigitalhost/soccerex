import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import gsap from 'gsap'

const navLinks = [
  { label: 'Events', to: '/events', isRoute: true },
  { label: 'About', to: '/about', isRoute: true },
  { label: 'Network', to: '/global-network', isRoute: true },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const overlayRef = useRef(null)
  const linksRef = useRef([])
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'
  // Force opaque on inner pages so the nav is always clearly visible
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

  // Scroll to top on route change unless a scroll target was requested via state
  useEffect(() => {
    if (!location.state?.scrollTo) window.scrollTo(0, 0)
  }, [location.pathname, location.state])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
      gsap.fromTo(overlayRef.current, { x: '100%' }, { x: '0%', duration: 0.45, ease: 'power3.out' })
      gsap.fromTo(linksRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.09, delay: 0.2, ease: 'power2.out' })
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const scrollTo = (id) => {
    setMenuOpen(false)
    if (isHome) {
      const el = document.querySelector(id)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else {
      // On inner pages, route home then scroll to the section once it mounts
      navigate('/', { state: { scrollTo: id } })
    }
  }

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
              link.isRoute ? (
                <Link key={link.to} to={link.to}
                  className="font-body font-semibold text-xs uppercase tracking-[0.15em] transition-colors duration-200 text-white/85 hover:text-white cursor-pointer whitespace-nowrap"
                  style={{ textDecoration: 'none' }}>
                  {link.label}
                </Link>
              ) : (
                <button key={link.to} onClick={() => scrollTo(link.to)}
                  className="font-body font-semibold text-xs uppercase tracking-[0.15em] transition-colors duration-200 text-white/85 hover:text-white bg-transparent border-none cursor-pointer whitespace-nowrap">
                  {link.label}
                </button>
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

      {menuOpen && (
        <div ref={overlayRef} className="fixed inset-0 z-50 flex flex-col" style={{ background: '#09203e', transform: 'translateX(100%)' }}>
          <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid rgba(191,177,112,0.2)' }}>
            <img src="/logos/soccerex---logo-landscape-white.svg" alt="Soccerex" style={{ height: '28px', width: 'auto' }} />
            <button onClick={() => setMenuOpen(false)} className="w-11 h-11 flex items-center justify-center text-white bg-transparent border-none cursor-pointer" aria-label="Close menu">
              <X size={22} />
            </button>
          </div>
          <div className="flex-1 flex flex-col items-start justify-center gap-1 px-8">
            {navLinks.map((link, i) => (
              link.isRoute ? (
                <Link key={link.to} to={link.to} ref={el => linksRef.current[i] = el} onClick={() => setMenuOpen(false)}
                  className="font-heading font-bold text-white opacity-0 py-3 uppercase tracking-[0.05em] hover:text-gold transition-colors cursor-pointer text-left"
                  style={{ fontSize: 'clamp(2rem, 7vw, 3.5rem)', textDecoration: 'none', display: 'block' }}>
                  {link.label}
                </Link>
              ) : (
                <button key={link.to} ref={el => linksRef.current[i] = el} onClick={() => scrollTo(link.to)}
                  className="font-heading font-bold text-white opacity-0 py-3 uppercase tracking-[0.05em] hover:text-gold transition-colors bg-transparent border-none cursor-pointer text-left"
                  style={{ fontSize: 'clamp(2rem, 7vw, 3.5rem)' }}>
                  {link.label}
                </button>
              )
            ))}
            <Link ref={el => linksRef.current[navLinks.length] = el} to="/contact" onClick={() => setMenuOpen(false)}
              className="inline-flex items-center gap-2 text-navy font-mono text-xs uppercase tracking-[0.2em] px-8 py-4 mt-6 opacity-0 transition-all duration-300 cursor-pointer border-none"
              style={{ background: '#bfb170', textDecoration: 'none' }}>
              Get in Touch
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
