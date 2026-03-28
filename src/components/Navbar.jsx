import { useState, useEffect, useRef } from 'react'
import { Menu, X } from 'lucide-react'
import gsap from 'gsap'

const navLinks = [
  { label: 'Events', to: '#events' },
  { label: 'About', to: '#about' },
  { label: 'Attend', to: '#why-soccerex' },
  { label: 'Partner', to: '#partner' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const overlayRef = useRef(null)
  const linksRef = useRef([])

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
    const el = document.querySelector(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 transition-all duration-400" style={{
        background: scrolled ? 'rgba(9,32,62,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(191,177,112,0.15)' : '1px solid transparent',
      }}>
        <div className="flex items-center justify-between px-6" style={{ maxWidth: '1200px', margin: '0 auto', height: '72px' }}>
          <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className="flex items-center gap-2">
            <span className="font-heading font-bold text-white tracking-[0.08em]" style={{ fontSize: '1.3rem' }}>SOCCEREX</span>
          </a>

          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <button key={link.to} onClick={() => scrollTo(link.to)}
                className="font-body font-semibold text-sm uppercase tracking-[0.15em] transition-colors duration-200 text-white/85 hover:text-white bg-transparent border-none cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </div>

          <button onClick={() => scrollTo('#partner')}
            className="hidden md:inline-flex items-center gap-2 text-navy font-body font-semibold text-sm uppercase tracking-[0.15em] px-6 py-3 transition-all duration-300 cursor-pointer"
            style={{ background: '#bfb170', border: '1px solid #bfb170' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#d4c78e'; e.currentTarget.style.borderColor = '#d4c78e' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#bfb170'; e.currentTarget.style.borderColor = '#bfb170' }}
          >
            Get Involved
          </button>

          <button onClick={() => setMenuOpen(true)} className="md:hidden w-11 h-11 flex items-center justify-center text-white bg-transparent border-none cursor-pointer" aria-label="Open menu">
            <Menu size={22} />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div ref={overlayRef} className="fixed inset-0 z-50 flex flex-col" style={{ background: '#09203e', transform: 'translateX(100%)' }}>
          <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid rgba(191,177,112,0.2)' }}>
            <span className="font-heading font-bold text-white tracking-[0.08em]" style={{ fontSize: '1.3rem' }}>SOCCEREX</span>
            <button onClick={() => setMenuOpen(false)} className="w-11 h-11 flex items-center justify-center text-white bg-transparent border-none cursor-pointer" aria-label="Close menu">
              <X size={22} />
            </button>
          </div>
          <div className="flex-1 flex flex-col items-start justify-center gap-1 px-8">
            {navLinks.map((link, i) => (
              <button key={link.to} ref={el => linksRef.current[i] = el} onClick={() => scrollTo(link.to)}
                className="font-heading font-bold text-white opacity-0 py-3 uppercase tracking-[0.05em] hover:text-gold transition-colors bg-transparent border-none cursor-pointer text-left"
                style={{ fontSize: 'clamp(2rem, 7vw, 3.5rem)' }}>
                {link.label}
              </button>
            ))}
            <button ref={el => linksRef.current[navLinks.length] = el} onClick={() => scrollTo('#partner')}
              className="inline-flex items-center gap-2 text-navy font-mono text-xs uppercase tracking-[0.2em] px-8 py-4 mt-6 opacity-0 transition-all duration-300 cursor-pointer border-none"
              style={{ background: '#bfb170' }}>
              Get Involved
            </button>
          </div>
        </div>
      )}
    </>
  )
}
