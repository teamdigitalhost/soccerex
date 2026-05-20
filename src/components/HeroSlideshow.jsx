import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { CONTACT } from '../lib/routes'
import { withTestSearch } from '../lib/testMode'

/* Static hero copy. The dark slideshow used to rotate through six
   taglines letter-by-letter; that's retired in favour of the static
   title + subtitle the light version landed on. */
const HERO_TITLE = 'The Leading Global Football Business Platform'
const HERO_SUBTITLE = 'Where World-Class Events Drive Deals, Partnerships, Innovation, and Impact Across the Game'

// ─── Hero images — built from manifest, shuffled fresh each visit ────────────
let ALL_IMAGES = []

// Fisher-Yates shuffle
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Interleave: 1 heritage, 2 random — heritage leads but each visit is unique
function buildPlaylist(heritage, modern) {
  const h = shuffle(heritage)
  const m = shuffle(modern)
  const result = []
  let hi = 0, mi = 0

  // Phase 1: interleave heritage with modern (1 heritage, 2 modern)
  while (hi < h.length && mi < m.length - 1) {
    result.push(h[hi++])
    result.push(m[mi++])
    result.push(m[mi++])
  }
  // Any remaining heritage
  while (hi < h.length) result.push(h[hi++])
  // All remaining modern (shuffled)
  while (mi < m.length) result.push(m[mi++])

  return result
}

// ─── Rotating taglines (each completes "30 Years...") ───────────────────────
const TAGLINES = [
  'of Connecting the Football Industry',
  'of Building Relationships That Matter',
  'of Shaping the Global Game',
  'Where Deals Get Done',
  'at the Center of Football Business',
  'of Uniting Clubs, Brands & Investors',
]

// ─── Letter-by-letter component ─────────────────────────────────────────────
function CascadingText({ text, visible, className = '' }) {
  const len = text.length
  return (
    <span className={`cascading-text ${className} ${visible ? 'cascading-visible' : ''}`} aria-label={text}>
      {text.split('').map((char, i) => (
        <span
          key={`${text}-${i}`}
          className="cascading-letter"
          style={{
            // Appear: stagger left-to-right (40ms per letter for visible cascade)
            // Disappear: stagger left-to-right too (so first letter exits first)
            transitionDelay: visible ? `${i * 40}ms` : `${i * 20}ms`,
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  )
}

// ─── Particle emitter radiating from around the "30" ────────────────────────
function ParticleField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let particles = []

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2
      canvas.height = canvas.offsetHeight * 2
      ctx.scale(2, 2)
    }
    resize()
    window.addEventListener('resize', resize)

    const W = () => canvas.offsetWidth
    const H = () => canvas.offsetHeight

    // Emit particles from an elliptical ring around center (where 30 lives)
    function spawn() {
      const cx = W() / 2
      const cy = H() / 2
      // Random angle
      const angle = Math.random() * Math.PI * 2
      // Start on an ellipse around the 30 (roughly matching digit bounds)
      const rx = 80 + Math.random() * 40
      const ry = 50 + Math.random() * 25
      const x = cx + Math.cos(angle) * rx
      const y = cy + Math.sin(angle) * ry
      // Radiate outward from center
      const speed = 0.15 + Math.random() * 0.35
      const vx = Math.cos(angle) * speed
      const vy = Math.sin(angle) * speed
      const life = 120 + Math.random() * 180 // frames
      const size = 0.5 + Math.random() * 1.5
      // Gold or white-gold color
      const gold = Math.random() > 0.3
      return { x, y, vx, vy, life, maxLife: life, size, gold }
    }

    function tick() {
      ctx.clearRect(0, 0, W(), H())

      // Spawn 1-2 particles per frame
      if (particles.length < 60) {
        particles.push(spawn())
        if (Math.random() > 0.5) particles.push(spawn())
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.life--

        if (p.life <= 0) {
          particles.splice(i, 1)
          continue
        }

        // Fade in quickly, fade out slowly
        const progress = 1 - p.life / p.maxLife
        let alpha
        if (progress < 0.1) {
          alpha = progress / 0.1 // fade in
        } else {
          alpha = 1 - (progress - 0.1) / 0.9 // fade out
        }
        alpha *= 0.4 // keep subtle

        if (p.gold) {
          ctx.fillStyle = `rgba(197, 165, 114, ${alpha})`
        } else {
          ctx.fillStyle = `rgba(220, 210, 180, ${alpha})`
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }

      animId = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="hero-particles" />
}

// ─── 3D SVG "30" with sweeping light — 3 and 0 breathe independently ────────
function Hero30SVG() {
  return (
    <div className="hero-30-container" aria-label="30">
      {/* Shared gradient defs */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          {/* Diagonal sweep for "3" — top-left to bottom-right */}
          <linearGradient id="sweepGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8a7a4a" />
            <stop offset="35%" stopColor="#c5a572" />
            <stop offset="50%" stopColor="#f0dca8" />
            <stop offset="65%" stopColor="#c5a572" />
            <stop offset="100%" stopColor="#8a7a4a" />
            <animateTransform attributeName="gradientTransform" type="translate"
              values="-1 -1; 1 1; 1 1" keyTimes="0; 0.44; 1" dur="4.5s" repeatCount="indefinite" />
          </linearGradient>
          {/* Diagonal sweep for "0" — same direction, 0.5s stagger */}
          <linearGradient id="sweepGrad0" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8a7a4a" />
            <stop offset="35%" stopColor="#c5a572" />
            <stop offset="50%" stopColor="#f0dca8" />
            <stop offset="65%" stopColor="#c5a572" />
            <stop offset="100%" stopColor="#8a7a4a" />
            <animateTransform attributeName="gradientTransform" type="translate"
              values="-1 -1; 1 1; 1 1" keyTimes="0; 0.44; 1" dur="4.5s" begin="0.5s" repeatCount="indefinite" />
          </linearGradient>
          <linearGradient id="shadowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#c5a572" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#6b5a30" stopOpacity="0.6" />
          </linearGradient>
        </defs>
      </svg>

      <div className="hero-30-digits">
        {/* "3" — breathes on its own cycle */}
        <div className="hero-digit hero-digit-3">
          <svg viewBox="10 0 80 160" className="hero-digit-svg">
            <text x="50%" y="55%" textAnchor="middle" dominantBaseline="central"
              className="hero-30-shadow" fill="url(#shadowGrad)" dx="3" dy="3">3</text>
            <text x="50%" y="55%" textAnchor="middle" dominantBaseline="central"
              className="hero-30-text" fill="url(#sweepGrad3)">3</text>
          </svg>
        </div>

        {/* "0" — breathes on a different cycle */}
        <div className="hero-digit hero-digit-0">
          <svg viewBox="5 0 90 160" className="hero-digit-svg">
            <text x="50%" y="55%" textAnchor="middle" dominantBaseline="central"
              className="hero-30-shadow" fill="url(#shadowGrad)" dx="3" dy="3">0</text>
            <text x="50%" y="55%" textAnchor="middle" dominantBaseline="central"
              className="hero-30-text" fill="url(#sweepGrad0)">0</text>
          </svg>
        </div>
      </div>
    </div>
  )
}

// ─── Oversized animated outline "30" background elements ────────────────────
function OutlineThirty() {
  // SVG path for "30" — oversized, thin stroke, section-spanning
  // Using a simplified geometric path for the numerals
  return (
    <div className="hero-outline-30s" aria-hidden="true">
      {/* Layer 1: Shifted left, slower animation */}
      <svg className="hero-outline-svg hero-outline-1" viewBox="0 0 600 300" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="outline1Grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c5a572" stopOpacity="0" />
            <stop offset="40%" stopColor="#c5a572" stopOpacity="0.12" />
            <stop offset="50%" stopColor="#f0dca8" stopOpacity="0.2" />
            <stop offset="60%" stopColor="#c5a572" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#c5a572" stopOpacity="0" />
            <animateTransform attributeName="gradientTransform" type="translate" from="-1.5 0" to="1.5 0" dur="6s" repeatCount="indefinite" />
          </linearGradient>
        </defs>
        <text x="50%" y="55%" textAnchor="middle" dominantBaseline="central"
          className="hero-outline-numeral"
          stroke="url(#outline1Grad)" fill="none" strokeWidth="1.2">
          30
        </text>
      </svg>

      {/* Layer 2: Shifted right, different timing */}
      <svg className="hero-outline-svg hero-outline-2" viewBox="0 0 600 300" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="outline2Grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a3fbf" stopOpacity="0" />
            <stop offset="35%" stopColor="#1a3fbf" stopOpacity="0.08" />
            <stop offset="50%" stopColor="#4a7aef" stopOpacity="0.15" />
            <stop offset="65%" stopColor="#1a3fbf" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#1a3fbf" stopOpacity="0" />
            <animateTransform attributeName="gradientTransform" type="translate" from="1.5 0" to="-1.5 0" dur="8s" repeatCount="indefinite" />
          </linearGradient>
        </defs>
        <text x="50%" y="55%" textAnchor="middle" dominantBaseline="central"
          className="hero-outline-numeral"
          stroke="url(#outline2Grad)" fill="none" strokeWidth="0.8">
          30
        </text>
      </svg>

      {/* Layer 3: Centered, very subtle, different phase */}
      <svg className="hero-outline-svg hero-outline-3" viewBox="0 0 600 300" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="outline3Grad" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#c5a572" stopOpacity="0" />
            <stop offset="40%" stopColor="#c5a572" stopOpacity="0.06" />
            <stop offset="50%" stopColor="#d4c78e" stopOpacity="0.1" />
            <stop offset="60%" stopColor="#c5a572" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#c5a572" stopOpacity="0" />
            <animateTransform attributeName="gradientTransform" type="translate" from="-1 -0.5" to="1 0.5" dur="10s" repeatCount="indefinite" />
          </linearGradient>
        </defs>
        <text x="50%" y="55%" textAnchor="middle" dominantBaseline="central"
          className="hero-outline-numeral"
          stroke="url(#outline3Grad)" fill="none" strokeWidth="1.5">
          30
        </text>
      </svg>
    </div>
  )
}

// ─── Main component ─────────────────────────────────────────────────────────
export default function HeroSlideshow() {
  const sectionRef = useRef(null)
  const [currentImage, setCurrentImage] = useState(0)
  const [showImage, setShowImage] = useState(true)
  const [textReady, setTextReady] = useState(false)
  const [transitioning, setTransitioning] = useState(false) // gold/blue fade between cycles

  // Load manifest + preload first few images
  const [imagesLoaded, setImagesLoaded] = useState(false)
  useEffect(() => {
    fetch('/hero-manifest.json')
      .then((r) => r.json())
      .then((data) => {
        // Build a fresh shuffled playlist: heritage every 3rd, modern randomized
        ALL_IMAGES = buildPlaylist(data.heritage || [], data.modern || [])
        setImagesLoaded(true)
        // Preload only the first 3 immediately. The slideshow advances every
        // few seconds and the per-cycle effect below preloads the next image
        // just before it is shown, so eager-loading the whole 200+ image
        // playlist (~100MB on first paint) was the cause of the "sometimes
        // fail to load or take a while" report. Just-in-time wins here.
        ALL_IMAGES.slice(0, 3).forEach((src) => { new Image().src = src })
      })
    const t = setTimeout(() => setTextReady(true), 500)
    return () => clearTimeout(t)
  }, [])

  // ── Fast image cycling (waits for manifest) ────────────────────────────
  useEffect(() => {
    if (!imagesLoaded || ALL_IMAGES.length === 0) return
    const interval = setInterval(() => {
      setShowImage(false) // fade out
      setTimeout(() => {
        setCurrentImage((prev) => {
          const next = (prev + 1) % ALL_IMAGES.length
          // Just-in-time preload: warm the cache for the image AFTER next so
          // the browser has it ready when the slide flips.
          const lookahead = (next + 1) % ALL_IMAGES.length
          new Image().src = ALL_IMAGES[lookahead]
          // At loop boundary, trigger gold flash
          if (next === 0) {
            setTransitioning(true)
            setTimeout(() => setTransitioning(false), 1200)
          }
          return next
        })
        setShowImage(true) // fade in new image
      }, 600) // wait for fade-out
    }, 2500) // 2.5s per image — fast cycling through 304 images

    return () => clearInterval(interval)
  }, [imagesLoaded])

  /* Rotating tagline cycle retired — static title + subtitle now. */

  return (
    <section ref={sectionRef} className="hero-slideshow relative overflow-hidden flex items-center justify-center" style={{ minHeight: '100dvh' }}>
      {/* Image layer — CSS transition driven */}
      <div
        className={`hero-image-layer ${showImage ? 'hero-img-visible' : 'hero-img-hidden'}`}
        style={{ backgroundImage: ALL_IMAGES.length ? `url(${ALL_IMAGES[currentImage]})` : 'none' }}
        aria-hidden="true"
      />

      {/* Oversized animated outline "30" background */}
      <OutlineThirty />

      {/* Gold/blue transition flash at loop boundary */}
      <div className={`hero-loop-transition ${transitioning ? 'hero-loop-active' : ''}`} aria-hidden="true" />

      {/* Dark gradient overlay */}
      <div className="hero-overlay" aria-hidden="true" />

      {/* Text content */}
      <div className={`hero-text relative z-10 text-center ${textReady ? 'hero-text-visible' : ''}`}
        style={{ maxWidth: '900px', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px) clamp(80px,10vw,120px)' }}>

        {/* Anniversary badge — new square blue design, replaces the
            old large "30 / YEARS" lockup. Square viewBox (100×100)
            so we render at 1:1; .hero-crest-wrap CSS handles the
            stacked white drop-shadow halo for the outer glow. */}
        <div className="hero-30-with-particles">
          <ParticleField />
          <div className="hero-crest-wrap hero-crest-wrap--square">
            <img
              src="/brand/crests/crest-main-blue.svg"
              alt=""
              aria-hidden="true"
              draggable={false}
            />
          </div>
        </div>

        {/* Gold divider */}
        <div className="hero-divider" />

        {/* Title — replaces the rotating tagline. Same large clamp
            sizing as the light version. */}
        <p
          className="hero-static-tagline font-heading leading-tight"
          style={{
            fontSize: 'clamp(1.95rem, 5vw, 2.6rem)',
            maxWidth: '900px',
            margin: '1.5rem auto 0.85rem',
            fontWeight: 700,
            lineHeight: 1.12,
            letterSpacing: '-0.01em',
            /* Sits over the cream-wash bottom of the overlay — dark
               navy reads cleanly. Soft cream halo lifts it off any
               photo detail that's still showing through. */
            color: '#0D1B2A',
            textShadow: '0 1px 0 rgba(255,248,244,0.7), 0 2px 18px rgba(255,248,244,0.55)',
          }}
        >
          {HERO_TITLE}
        </p>

        {/* Subtitle — replaces the old "World's Premier…" eyebrow-
            style subline. */}
        <p
          className="hero-static-subtitle font-body leading-relaxed"
          style={{
            fontSize: 'clamp(1.15rem, 2vw, 1.55rem)',
            maxWidth: '840px',
            margin: '0 auto 2.5rem',
            fontWeight: 600,
            lineHeight: 1.4,
            color: '#1d2a3d',
            textShadow: '0 1px 0 rgba(255,248,244,0.65), 0 1px 14px rgba(255,248,244,0.5)',
          }}
        >
          {HERO_SUBTITLE}
        </p>

        {/* CTAs */}
        <div className="hero-ctas flex flex-wrap items-center justify-center gap-4">
          <button onClick={() => document.querySelector('#events')?.scrollIntoView({ behavior: 'smooth' })}
            className="hero-cta-gold inline-flex items-center gap-2 font-body font-semibold text-sm uppercase tracking-[0.15em] px-8 py-4 transition-all duration-300 cursor-pointer border-none">
            Explore Events <ArrowRight size={16} />
          </button>
          <Link
            to={withTestSearch(CONTACT)}
            className="hero-cta-outline inline-flex items-center gap-2 font-body font-semibold text-sm uppercase tracking-[0.15em] px-8 py-4 transition-all duration-300 cursor-pointer"
            style={{ textDecoration: 'none', color: '#09203e', borderColor: '#09203e' }}
          >
            Contact Soccerex
          </Link>
        </div>
      </div>
    </section>
  )
}
