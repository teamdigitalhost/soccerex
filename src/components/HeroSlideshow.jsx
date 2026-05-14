import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import Crest from './Crest'

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

// ─── Static tagline (CEO-approved statement) ────────────────────────────────
// Rotating taglines archived in HeroSlideshow.baseline.jsx for future reuse.
const HERO_TITLE    = 'The Longest-Running Football Business Platform'
const HERO_SUBTITLE = 'Fueling the Global Growth of the Game Through World-Class Events, Insight, and Partnership'

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
    /* Respect users who've asked the OS to dial down motion — skip
       the canvas animation entirely for them. */
    if (typeof window !== 'undefined'
        && window.matchMedia
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }
    /* Confetti canvas off on the low-perf tier. The RAF loop on a
       full-viewport canvas was the dominant frame-time cost on
       iPad Safari. Desktop keeps the full effect below. */
    if (typeof window !== 'undefined' && window.innerWidth < 1280) {
      return
    }
    /* Three perf tiers, picked from viewport width + device hints.
       Anything narrower than typical laptop (1280px) is treated as
       "low-perf" — covers phones, iPads (landscape ~1024-1366),
       and small tablets running Safari, which all struggle on the
       full canvas + shine + scale-animated photo. Very-low-perf
       (deviceMemory ≤ 4GB OR hardwareConcurrency ≤ 4) gets the
       harshest cuts: 1x DPR canvas, half framerate, even fewer
       particles. */
    const lowPerf = typeof window !== 'undefined' && window.innerWidth < 1280
    const dm = typeof navigator !== 'undefined' ? (navigator.deviceMemory || 8) : 8
    const hc = typeof navigator !== 'undefined' ? (navigator.hardwareConcurrency || 8) : 8
    const veryLowPerf = lowPerf && (dm <= 4 || hc <= 4)
    const isMobile = lowPerf /* alias kept so existing knobs below still read */
    const ctx = canvas.getContext('2d')
    let animId
    let particles = []
    let frame = 0
    const BURST_DURATION = 150 // frames for intro burst (~2.5s, celebratory)
    const BURST_COUNT = veryLowPerf ? 50  : isMobile ? 100 : 520
    const AMBIENT_CAP = veryLowPerf ? 18  : isMobile ? 35  : 160
    /* Half framerate on the weakest tier — visually fine for soft
       confetti, halves CPU/GPU spend on this canvas. */
    const FRAME_STEP = veryLowPerf ? 2 : 1

    const resize = () => {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      if (w === 0 || h === 0) return /* parent not laid out yet — try again next frame */
      /* On low-perf tier we paint at 1x DPR. The canvas covers the
         entire hero (often 1024×800+ on iPad) — running it at 2x
         means ~3M pixels cleared and redrawn every frame. 1x is
         visually indistinguishable for soft confetti circles and
         cuts the per-frame fill rate by 4x. */
      const dpr = lowPerf ? 1 : 2
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener('resize', resize)
    /* The crest image grows the parent after it loads, so observe size
       changes and re-fit the canvas — otherwise it stays at its initial
       (possibly 0x0) dimensions and never renders. */
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null
    if (ro) ro.observe(canvas)

    const W = () => canvas.offsetWidth
    const H = () => canvas.offsetHeight

    /* SCALE governs the burst radius and particle sizes. Hold the
       full 1.3 on desktop; drop it back to ~1.0 on mobile so the
       smaller particle budget still reads as confetti. */
    const SCALE = isMobile ? 1.0 : 1.3

    // Spawn a particle radiating outward from around the "30"
    function spawn(isBurst = false) {
      const cx = W() / 2
      const cy = H() / 2
      const angle = Math.random() * Math.PI * 2
      // Start near the digits — radius scaled up so the burst pattern is
      // visibly wider around the badge.
      const rx = (60 + Math.random() * 50) * SCALE
      const ry = (40 + Math.random() * 30) * SCALE
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
        // Confetti colors: gold tones only — three shades for depth without
        // breaking the gold story (deep, brand gold, warm highlight).
        const colorRoll = Math.random()
        let color
        if (colorRoll < 0.5) color = 'gold'           // brand gold
        else if (colorRoll < 0.8) color = 'gold-warm' // warm highlight
        else color = 'gold-deep'                       // deeper amber
        return {
          x, y,
          vx: radialVx + tangentVx,
          vy: radialVy + tangentVy,
          life,
          maxLife: life,
          size: (1 + Math.random() * 3.5) * SCALE,
          color,
          burst: true,
        }
      }
      // Ambient particles: slow drift, but sized + coloured like burst
      // particles so they read with the same presence (just at a calmer
      // pace and direction).
      const speed = 0.2 + Math.random() * 0.6
      const colorRoll = Math.random()
      let color
      if (colorRoll < 0.5) color = 'gold'
      else if (colorRoll < 0.8) color = 'gold-warm'
      else color = 'gold-deep'
      return {
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 150 + Math.random() * 250,
        maxLife: 150 + Math.random() * 250,
        size: (1 + Math.random() * 3.5) * SCALE, /* matches burst range */
        color,
        gold: true,
        burst: false,
      }
    }

    /* IntersectionObserver pauses the RAF loop once the hero scrolls
       offscreen — no point burning frames on an invisible canvas. */
    let visible = true
    let io
    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver((entries) => {
        visible = entries[0]?.isIntersecting ?? true
      }, { threshold: 0.01 })
      io.observe(canvas)
    }

    let frameSkip = 0
    function tick() {
      if (!visible) {
        animId = requestAnimationFrame(tick)
        return
      }
      /* On very-low-perf, render every other RAF callback (~30fps). */
      if (FRAME_STEP > 1) {
        frameSkip = (frameSkip + 1) % FRAME_STEP
        if (frameSkip !== 0) {
          animId = requestAnimationFrame(tick)
          return
        }
      }
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
      if (particles.length < AMBIENT_CAP) {
        particles.push(spawn(false))
        if (Math.random() > 0.4) particles.push(spawn(false))
        if (Math.random() > 0.6) particles.push(spawn(false))
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
        // Run at full opacity for burst and ambient. The multiply blend
        // keeps the gold warm rather than garish, and the larger sizes +
        // higher density carry the effect further across the hero.
        alpha *= p.burst ? 1.0 : 1.0

        /* Same three ember-gold tones for burst AND ambient — only
           speed and lifetime differ between the two. */
        if (p.color === 'gold')           ctx.fillStyle = `rgba(160, 110,  35, ${alpha})` // brand gold (deeper)
        else if (p.color === 'gold-warm') ctx.fillStyle = `rgba(200, 155,  60, ${alpha})` // warm highlight
        else                              ctx.fillStyle = `rgba(100,  65,  20, ${alpha})` // amber

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
      if (ro) ro.disconnect()
      if (io) io.disconnect()
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
/* Three drifting outline "30"s sit behind the crest. On the light hero they
   read as ambient brand colour. Two blue layers (Soccerex navy → mid-blue)
   bracket one ember-orange layer in the middle — the orange becomes the
   visual hook, the blues anchor the brand. */
function OutlineThirty() {
  return (
    <div className="hero-outline-30s" aria-hidden="true">
      {/* Layer 1: deep brand navy, drifting slowly. Higher opacity so it
          actually reads against the cream wash. */}
      <svg className="hero-outline-svg hero-outline-1" viewBox="0 0 600 300" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="outline1Grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"  stopColor="#09203e" stopOpacity="0" />
            <stop offset="40%" stopColor="#09203e" stopOpacity="0.32" />
            <stop offset="50%" stopColor="#1a3fbf" stopOpacity="0.46" />
            <stop offset="60%" stopColor="#09203e" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#09203e" stopOpacity="0" />
            <animateTransform attributeName="gradientTransform" type="translate" from="-1.5 0" to="1.5 0" dur="6s" repeatCount="indefinite" />
          </linearGradient>
        </defs>
        <text x="50%" y="55%" textAnchor="middle" dominantBaseline="central"
          className="hero-outline-numeral"
          stroke="url(#outline1Grad)" fill="none" strokeWidth="1.2">
          30
        </text>
      </svg>

      {/* Layer 2: Soccerex ember orange — the warm accent that drifts the
          other direction. */}
      <svg className="hero-outline-svg hero-outline-2" viewBox="0 0 600 300" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="outline2Grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"  stopColor="#ff6b35" stopOpacity="0" />
            <stop offset="35%" stopColor="#ff6b35" stopOpacity="0.30" />
            <stop offset="50%" stopColor="#ff8a5b" stopOpacity="0.46" />
            <stop offset="65%" stopColor="#ff6b35" stopOpacity="0.30" />
            <stop offset="100%" stopColor="#ff6b35" stopOpacity="0" />
            <animateTransform attributeName="gradientTransform" type="translate" from="1.5 0" to="-1.5 0" dur="8s" repeatCount="indefinite" />
          </linearGradient>
        </defs>
        <text x="50%" y="55%" textAnchor="middle" dominantBaseline="central"
          className="hero-outline-numeral"
          stroke="url(#outline2Grad)" fill="none" strokeWidth="1.0">
          30
        </text>
      </svg>

      {/* Layer 3: lighter mid-blue, third phase. Slightly heavier stroke so
          its slow drift reads as the calm background layer. */}
      <svg className="hero-outline-svg hero-outline-3" viewBox="0 0 600 300" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="outline3Grad" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"  stopColor="#1a3fbf" stopOpacity="0" />
            <stop offset="40%" stopColor="#1a3fbf" stopOpacity="0.22" />
            <stop offset="50%" stopColor="#4a7aef" stopOpacity="0.34" />
            <stop offset="60%" stopColor="#1a3fbf" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#1a3fbf" stopOpacity="0" />
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
        // Only preload the first 3 images; the rest load via rolling window
        ALL_IMAGES.slice(0, 3).forEach((src) => { new Image().src = src })
      })
    const t = setTimeout(() => setTextReady(true), 500)
    return () => clearTimeout(t)
  }, [])

  // ── Fast image cycling (waits for manifest) ────────────────────────────
  useEffect(() => {
    if (!imagesLoaded || ALL_IMAGES.length === 0) return
    /* Three-tier cadence so iPad / phones don't burn cycles on a 4s
       crossfade while the user is reading. The slideshow IS the
       hero — never freeze it — but on low-perf devices we hold each
       photo longer so the per-frame compositor cost is amortized
       over a calmer cadence. */
    const lowPerf = typeof window !== 'undefined' && window.innerWidth < 1280
    const SLIDE_HOLD_MS = lowPerf ? 7000 : 4000   // time per image
    const FADE_OUT_MS   = lowPerf ? 500  : 800    // crossfade duration

    /* Pause the cycle while the hero is offscreen so the user
       scrolling the rest of the page isn't paying for transitions
       they can't see. */
    let isVisible = true
    let io
    const section = sectionRef.current
    if (section && typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver((entries) => {
        isVisible = entries[0]?.isIntersecting ?? true
      }, { threshold: 0.05 })
      io.observe(section)
    }

    const interval = setInterval(() => {
      if (!isVisible) return
      setShowImage(false) // fade out
      setTimeout(() => {
        setCurrentImage((prev) => {
          const next = (prev + 1) % ALL_IMAGES.length
          /* Preload one image ahead (was two). Two parallel decodes
             on iPad can spike memory/jank during the crossfade. */
          const ahead1 = (next + 1) % ALL_IMAGES.length
          new Image().src = ALL_IMAGES[ahead1]
          if (!lowPerf) {
            const ahead2 = (next + 2) % ALL_IMAGES.length
            new Image().src = ALL_IMAGES[ahead2]
          }
          // At loop boundary, trigger gold flash
          if (next === 0) {
            setTransitioning(true)
            setTimeout(() => setTransitioning(false), 1200)
          }
          return next
        })
        setShowImage(true) // fade in new image
      }, FADE_OUT_MS) // wait for fade-out
    }, SLIDE_HOLD_MS) // photo cadence

    return () => {
      clearInterval(interval)
      if (io) io.disconnect()
    }
  }, [imagesLoaded])

  // (Rotating tagline logic retired. Kept baseline copy in HeroSlideshow.baseline.jsx.)

  return (
    /* data-theme="light" flips the slideshow to a cream/white treatment.
       To revert to the original dark cinematic look, change to "dark" — the
       full CSS for both themes lives in index.css and animations are
       identical between modes. */
    <section ref={sectionRef} data-theme="light"
      className="hero-slideshow relative overflow-hidden flex items-center justify-center"
      style={{ minHeight: '100dvh' }}>
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

      {/* Gradient overlay — light/dark variant driven by [data-theme] in CSS */}
      <div className="hero-overlay" aria-hidden="true" />

      {/* Text content — crest-led anniversary edition lockup */}
      <div className={`hero-text relative z-10 text-center ${textReady ? 'hero-text-visible' : ''}`}
        style={{ maxWidth: '900px', padding: 'clamp(40px,6vw,90px) clamp(24px,5vw,80px) clamp(60px,8vw,100px)' }}>

        {/* Anniversary crest. In light mode we use the black crest so it
            reads against the cream-washed photos.

            Layout: .hero-crest-wrap handles the entrance fade/scale.
            .hero-crest-float is an inner element that runs a continuous
            slow float so the float never fights the entrance transition.
            .hero-crest-shine sits on top of the badge image with a mask
            shaped to the badge silhouette + a sweeping gradient
            background that's blended onto the black SVG, producing a
            "polished metal" highlight that drifts across the crest. */}
        <div className="hero-30-with-particles">
          <ParticleField />
          <div className="hero-crest-wrap">
            <div className="hero-crest-float">
              <Crest variant="main" color="black" size={280} decorative />
              <div className="hero-crest-shine" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Gold divider */}
        <div className="hero-divider" />

        {/* Title + subtitle. Title eased down a notch; subtitle pulled up
            so it reads as a proper deck/subtitle pair, not headline + fine
            print. Both sit over the cream dissolve below. */}
        <p
          className="hero-static-tagline font-heading leading-tight"
          style={{
            /* Mobile floor pushed up so the title reads as a hero
               headline, not body copy. Scales aggressively from
               ~31px on phones up to ~42px on desktop. */
            fontSize: 'clamp(1.95rem, 5vw, 2.6rem)',
            maxWidth: '900px',
            margin: '1.5rem auto 0.85rem',
            fontWeight: 700,
            lineHeight: 1.12,
            letterSpacing: '-0.01em',
          }}
        >
          {HERO_TITLE}
        </p>
        <p
          className="hero-static-subtitle font-body leading-relaxed"
          style={{
            fontSize: 'clamp(1.15rem, 2vw, 1.55rem)',
            maxWidth: '840px',
            margin: '0 auto 2.5rem',
            fontWeight: 600,
            lineHeight: 1.4,
          }}
        >
          {HERO_SUBTITLE}
        </p>

        {/* CTAs */}
        <div className="hero-ctas flex flex-wrap items-center justify-center gap-4">
          <a href="/events" style={{ textDecoration: 'none' }}
            className="hero-cta-gold inline-flex items-center gap-2 font-body font-semibold text-sm uppercase tracking-[0.15em] px-8 py-4 transition-all duration-300 cursor-pointer border-none">
            Explore Events <ArrowRight size={16} />
          </a>
          <a href="/contact"
            className="hero-cta-outline inline-flex items-center gap-2 font-body font-semibold text-sm uppercase tracking-[0.15em] px-8 py-4 transition-all duration-300 cursor-pointer"
            style={{ textDecoration: 'none' }}>
            Join Soccerex
          </a>
        </div>
      </div>
    </section>
  )
}
