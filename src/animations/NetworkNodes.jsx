import { useRef, useEffect } from 'react'

/**
 * Ambient network-node background animation.
 *
 * `color`       — base color as hex (e.g. "#ffffff") OR a CSS variable
 *                 reference (e.g. "var(--color-brand-accent)"). CSS vars are
 *                 resolved at mount time to avoid canvas NaN bugs.
 * `accentColor` — optional hex/var for a small percentage of nodes.
 *                 Makes the field feel less monochrome and more "alive."
 * `accentRatio` — 0..1 fraction of nodes drawn in accentColor. Default 0.18.
 * `nodeCount`   — total number of particles.
 * `opacity`     — base opacity multiplier (lines + dots are fractions of this).
 */
export default function NetworkNodes({
  color = 'rgba(255,255,255,0.9)',
  accentColor = null,
  accentRatio = 0.18,
  nodeCount = 30,
  opacity = 0.15,
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    // Resolve color (hex, rgba, OR "var(--x)") to a concrete {r,g,b} triple.
    // Fall back to soft white for anything we cannot parse.
    function toRgb(raw, fallback = { r: 255, g: 255, b: 255 }) {
      if (!raw) return fallback
      let val = String(raw).trim()
      // Strip var() wrapper and look up the computed value on :root
      const varMatch = val.match(/^var\(([^,)]+)(?:,\s*([^)]+))?\)$/)
      if (varMatch) {
        const name = varMatch[1].trim()
        const dflt = varMatch[2]?.trim()
        const resolved = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
        val = resolved || dflt || ''
      }
      if (!val) return fallback
      // Hex forms
      const hex = val.match(/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
      if (hex) {
        let h = hex[1]
        if (h.length === 3) h = h.split('').map(c => c + c).join('')
        const n = parseInt(h, 16)
        return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
      }
      // rgb / rgba
      const rgb = val.match(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/)
      if (rgb) return { r: +rgb[1], g: +rgb[2], b: +rgb[3] }
      return fallback
    }

    const base = toRgb(color, { r: 255, g: 255, b: 255 })
    const accent = accentColor ? toRgb(accentColor, null) : null

    // Halve node count on the smallest phones (under 390px)
    const isSmallDevice = window.innerWidth < 390
    const effectiveCount = isSmallDevice ? Math.max(6, Math.floor(nodeCount / 2)) : nodeCount

    const dpr = isSmallDevice ? 1 : 2
    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener('resize', resize)

    const W = () => canvas.offsetWidth
    const H = () => canvas.offsetHeight

    // Each node may independently be the accent color.
    const nodes = Array.from({ length: effectiveCount }, () => ({
      x: Math.random() * W(),
      y: Math.random() * H(),
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      size: 1.2 + Math.random() * 2.2,
      pulse: Math.random() * Math.PI * 2,
      isAccent: accent && Math.random() < accentRatio,
    }))

    const maxDist = 150

    // On mobile (<768px), throttle to ~30fps
    const isMobile = window.innerWidth < 768
    const frameInterval = isMobile ? 33 : 0
    let lastFrame = 0

    let animId
    function draw(now) {
      if (isMobile && now - lastFrame < frameInterval) {
        animId = requestAnimationFrame(draw)
        return
      }
      lastFrame = now
      ctx.clearRect(0, 0, W(), H())

      nodes.forEach(n => {
        n.x += n.vx
        n.y += n.vy
        n.pulse += 0.016
        if (n.x < 0 || n.x > W()) n.vx *= -1
        if (n.y < 0 || n.y > H()) n.vy *= -1
      })

      // Lines — always use base color, very subtle
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * opacity * 0.6
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.strokeStyle = `rgba(${base.r}, ${base.g}, ${base.b}, ${alpha})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      // Nodes — mix of base + accent
      nodes.forEach(n => {
        const col = n.isAccent && accent ? accent : base
        const pulseSize = n.size + Math.sin(n.pulse) * 0.7

        // Soft halo
        ctx.beginPath()
        ctx.arc(n.x, n.y, pulseSize * 3, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${col.r}, ${col.g}, ${col.b}, ${opacity * 0.22})`
        ctx.fill()

        // Core dot
        ctx.beginPath()
        ctx.arc(n.x, n.y, pulseSize, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${col.r}, ${col.g}, ${col.b}, ${opacity * (n.isAccent ? 1.8 : 1.3)})`
        ctx.fill()
      })

      animId = requestAnimationFrame(draw)
    }

    animId = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
    // eslint-disable-next-line
  }, [color, accentColor, accentRatio, nodeCount, opacity])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  )
}
