import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'

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

  // Alternate 1 heritage, 1 modern until heritage runs out
  while (hi < h.length && mi < m.length) {
    result.push(h[hi++])
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
  'of Deals Getting Done',
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
    let frame = 0
    const BURST_DURATION = 150 // frames for intro burst (~2.5s, celebratory)
    const BURST_COUNT = 350 // dense confetti coverage

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2
      canvas.height = canvas.offsetHeight * 2
      ctx.scale(2, 2)
    }
    resize()
    window.addEventListener('resize', resize)

    const W = () => canvas.offsetWidth
    const H = () => canvas.offsetHeight

    // Spawn a particle radiating outward from around the "30"
    function spawn(isBurst = false) {
      const cx = W() / 2
      const cy = H() / 2
      const angle = Math.random() * Math.PI * 2
      // Start near the digits
      const rx = 60 + Math.random() * 50
      const ry = 40 + Math.random() * 30
      const x = cx + Math.cos(angle) * rx
      const y = cy + Math.sin(angle) * ry

      if (isBurst) {
        // Burst particles: fast enough to reach screen edges, with spin
        const maxDist = Math.max(W(), H()) / 2
        const speed = (maxDist / 80) * (0.6 + Math.random() * 0.8) // calibrated to reach edges over ~80 frames
        // Add tangential spin component (perpendicular to radial direction)
        const spinStrength = 0.3 + Math.random() * 0.5
        const spinDir = Math.random() > 0.5 ? 1 : -1
        const radialVx = Math.cos(angle) * speed
        const radialVy = Math.sin(angle) * speed
        // Tangential = perpendicular to radial
        const tangentVx = -Math.sin(angle) * speed * spinStrength * spinDir
        const tangentVy = Math.cos(angle) * speed * spinStrength * spinDir
        const life = 90 + Math.random() * 120
        // Confetti colors: gold, white, silver
        const colorRoll = Math.random()
        let color
        if (colorRoll < 0.45) color = 'gold'
        else if (colorRoll < 0.75) color = 'white'
        else color = 'silver'
        return {
          x, y,
          vx: radialVx + tangentVx,
          vy: radialVy + tangentVy,
          life,
          maxLife: life,
          size: 1 + Math.random() * 3.5,
          color,
          burst: true,
        }
      }
      // Ambient particles: slow, gentle, wide reach
      const speed = 0.2 + Math.random() * 0.6
      return {
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 150 + Math.random() * 250,
        maxLife: 150 + Math.random() * 250,
        size: 0.5 + Math.random() * 2,
        gold: Math.random() > 0.25,
        burst: false,
      }
    }

    function tick() {
      ctx.clearRect(0, 0, W(), H())
      frame++

      // Intro burst: spawn many fast particles in the first ~1.5s
      if (frame <= BURST_DURATION) {
        const spawnRate = Math.ceil(BURST_COUNT / BURST_DURATION)
        for (let s = 0; s < spawnRate; s++) {
          particles.push(spawn(true))
        }
      }

      // Ambient: continuous gentle emission
      if (particles.length < 100) {
        particles.push(spawn(false))
        if (Math.random() > 0.4) particles.push(spawn(false))
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        // Gentle deceleration for burst particles (graceful spiral outward)
        if (p.burst) {
          p.vx *= 0.992
          p.vy *= 0.992
        }
        p.life--

        if (p.life <= 0) {
          particles.splice(i, 1)
          continue
        }

        const progress = 1 - p.life / p.maxLife
        let alpha
        if (progress < 0.08) {
          alpha = progress / 0.08
        } else {
          alpha = 1 - (progress - 0.08) / 0.92
        }
        // Burst particles are brighter, ambient are subtler
        alpha *= p.burst ? 0.65 : 0.35

        if (p.burst) {
          if (p.color === 'gold') ctx.fillStyle = `rgba(197, 165, 114, ${alpha})`
          else if (p.color === 'white') ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
          else ctx.fillStyle = `rgba(190, 200, 210, ${alpha})` // silver
        } else {
          // Ambient: always gold tones
          ctx.fillStyle = p.gold
            ? `rgba(197, 165, 114, ${alpha})`
            : `rgba(240, 220, 168, ${alpha})`
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

// ─── 3D SVG "30" with Roboto Slab ───────────────────────────────────────────
function Hero30SVG() {
  return (
    <div className="hero-30-container" aria-label="30">
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="sweepGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8a7a4a" />
            <stop offset="35%" stopColor="#c5a572" />
            <stop offset="50%" stopColor="#f0dca8" />
            <stop offset="65%" stopColor="#c5a572" />
            <stop offset="100%" stopColor="#8a7a4a" />
            <animateTransform attributeName="gradientTransform" type="translate"
              values="-1 -1; 1 1; 1 1" keyTimes="0; 0.44; 1" dur="4.5s" repeatCount="indefinite" />
          </linearGradient>
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
        <div className="hero-digit hero-digit-3">
          <svg viewBox="5 0 90 160" className="hero-digit-svg">
            <text x="50%" y="55%" textAnchor="middle" dominantBaseline="central"
              className="hero-30-shadow" fill="url(#shadowGrad)" dx="3" dy="3">3</text>
            <text x="50%" y="55%" textAnchor="middle" dominantBaseline="central"
              className="hero-30-text" fill="url(#sweepGrad3)">3</text>
          </svg>
        </div>
        <div className="hero-digit hero-digit-0">
          <svg viewBox="0 0 95 160" className="hero-digit-svg">
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
  const [taglineIndex, setTaglineIndex] = useState(0)
  const SUBLINE_WORDS = ['Event', 'Platform']
  const [sublineWord, setSublineWord] = useState(0)
  const [taglineVisible, setTaglineVisible] = useState(false)
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
        // Preload first 5 immediately
        ALL_IMAGES.slice(0, 5).forEach((src) => { new Image().src = src })
        // Lazy preload the rest in batches
        let i = 5
        const preloadBatch = () => {
          const batch = ALL_IMAGES.slice(i, i + 10)
          batch.forEach((src) => { new Image().src = src })
          i += 10
          if (i < ALL_IMAGES.length) setTimeout(preloadBatch, 500)
        }
        setTimeout(preloadBatch, 2000)
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

  // ── Rotating tagline cycle ────────────────────────────────────────────
  useEffect(() => {
    let interval
    // Show first tagline after intro animations settle
    const showTimer = setTimeout(() => {
      // Letters already rendered hidden; trigger cascade on next frame
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setTaglineVisible(true))
      })
      // Start cycling only after first tagline is shown
      interval = setInterval(() => {
        setTaglineVisible(false)
        setTimeout(() => {
          // Step 1: render new letters (hidden)
          setTaglineIndex((prev) => (prev + 1) % TAGLINES.length)
          setSublineWord((prev) => (prev + 1) % SUBLINE_WORDS.length)
          // Step 2: on next frame, trigger the cascade-in transition
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              setTaglineVisible(true)
            })
          })
        }, 1200)
      }, 3300)
    }, 2500)
    return () => { clearTimeout(showTimer); if (interval) clearInterval(interval) }
  }, [])

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

        {/* Eyebrow */}
        <p className="hero-eyebrow section-label text-gold mb-2">
          SOCCEREX &middot; EST. 1996
        </p>

        {/* 3D SVG "30" with particles radiating from behind */}
        <div className="hero-30-with-particles">
          <ParticleField />
          <Hero30SVG />
        </div>

        {/* "Years" under the 30 */}
        <div className="hero-years">YEARS</div>

        {/* Gold divider */}
        <div className="hero-divider" />

        {/* Rotating tagline with letter-by-letter cascade */}
        <div className="hero-tagline-wrapper">
          <CascadingText
            text={TAGLINES[taglineIndex]}
            visible={taglineVisible}
            className="hero-tagline"
          />
        </div>

        {/* Subline */}
        <p className="hero-subline font-body text-white/45 leading-relaxed mt-6 mb-10"
          style={{ fontSize: 'clamp(0.8rem, 1.2vw, 0.95rem)', maxWidth: '500px', margin: '1.5rem auto 2.5rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          The World's Premier Football Business Platform
        </p>

        {/* CTAs */}
        <div className="hero-ctas flex flex-wrap items-center justify-center gap-4">
          <button onClick={() => document.querySelector('#events')?.scrollIntoView({ behavior: 'smooth' })}
            className="hero-cta-gold inline-flex items-center gap-2 font-body font-semibold text-sm uppercase tracking-[0.15em] px-8 py-4 transition-all duration-300 cursor-pointer border-none">
            Explore Events <ArrowRight size={16} />
          </button>
          <button onClick={() => document.querySelector('#partner')?.scrollIntoView({ behavior: 'smooth' })}
            className="hero-cta-outline inline-flex items-center gap-2 font-body font-semibold text-sm uppercase tracking-[0.15em] px-8 py-4 transition-all duration-300 cursor-pointer text-white">
            Partner with Soccerex
          </button>
        </div>
      </div>
    </section>
  )
}
