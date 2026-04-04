import { useEffect, useRef } from 'react'

/**
 * Layered smooth wave divider with transparency.
 * Multiple wave layers at different speeds/opacities for depth.
 *
 * Props:
 *   color   - the color of the section above
 *   layers  - number of wave layers (default 2)
 *   height  - total height in px (default 80)
 *   speed   - animation speed (default 1)
 *   flip    - flip vertically (default false)
 */
export default function PixelDivider({
  color = '#200808',
  layers = 2,
  height = 80,
  speed = 1,
  flip = false,
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let frame = 0

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener('resize', resize)

    function parseColor(hex) {
      const c = hex.replace('#', '')
      if (c.length === 3) return [parseInt(c[0]+c[0],16), parseInt(c[1]+c[1],16), parseInt(c[2]+c[2],16)]
      return [parseInt(c.slice(0,2),16), parseInt(c.slice(2,4),16), parseInt(c.slice(4,6),16)]
    }

    const rgb = parseColor(color)

    // Each layer has unique wave parameters
    const layerConfigs = Array.from({ length: layers }, (_, i) => ({
      // Front layers sit lower, back layers higher
      yOffset: 0.3 + i * 0.15,
      // Each layer has different wave frequencies
      freq1: 2.0 + i * 0.8,
      freq2: 3.7 - i * 0.5,
      freq3: 5.1 + i * 1.2,
      // Each layer animates at a slightly different speed
      speedMult: 1 - i * 0.3,
      // Back layers are more transparent
      opacity: 1 - i * (0.5 / layers),
      // Amplitude decreases for back layers
      amp1: 0.25 - i * 0.05,
      amp2: 0.12 - i * 0.02,
      amp3: 0.06,
    }))

    function draw() {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)

      // Draw layers back to front (last config = backmost, drawn first)
      for (let li = layers - 1; li >= 0; li--) {
        const cfg = layerConfigs[li]
        const t = frame * 0.008 * speed * cfg.speedMult

        ctx.beginPath()
        ctx.moveTo(0, 0)

        // Waves use only 60% of the container height, centered vertically
        const waveZone = h * 0.6
        const waveTop = h * 0.2

        for (let x = 0; x <= w; x += 2) {
          const nx = x / w
          const wave1 = Math.sin(nx * Math.PI * cfg.freq1 + t) * cfg.amp1
          const wave2 = Math.sin(nx * Math.PI * cfg.freq2 + t * 1.3) * cfg.amp2
          const wave3 = Math.sin(nx * Math.PI * cfg.freq3 + t * 0.7) * cfg.amp3
          const combined = cfg.yOffset + wave1 + wave2 + wave3
          ctx.lineTo(x, waveTop + combined * waveZone)
        }

        ctx.lineTo(w, 0)
        ctx.closePath()
        ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${cfg.opacity})`
        ctx.fill()
      }

      frame++
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [color, layers, height, speed])

  return (
    <div style={{
      position: 'relative',
      height: `${height}px`,
      pointerEvents: 'none',
      zIndex: 5,
      marginBottom: `-${height}px`,
      transform: flip ? 'scaleY(-1)' : 'none',
    }}>
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />
    </div>
  )
}
