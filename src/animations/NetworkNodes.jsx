import { useRef, useEffect } from 'react'

export default function NetworkNodes({ color = '#1a3fbf', nodeCount = 30, opacity = 0.15 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    // Halve node count on the smallest phones (under 390px, e.g. iPhone SE/Mini)
    // Pro Max (430px) and larger get the full effect
    const isSmallDevice = window.innerWidth < 390
    const effectiveCount = isSmallDevice ? Math.max(6, Math.floor(nodeCount / 2)) : nodeCount

    const dpr = isSmallDevice ? 1 : 2
    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener('resize', resize)

    const W = () => canvas.offsetWidth
    const H = () => canvas.offsetHeight

    const nodes = Array.from({ length: effectiveCount }, () => ({
      x: Math.random() * W(),
      y: Math.random() * H(),
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: 1.5 + Math.random() * 2.5,
      pulse: Math.random() * Math.PI * 2,
    }))

    const maxDist = 150

    const r = parseInt(color.slice(1,3), 16)
    const g = parseInt(color.slice(3,5), 16)
    const b = parseInt(color.slice(5,7), 16)

    let animId
    function draw() {
      ctx.clearRect(0, 0, W(), H())

      nodes.forEach(n => {
        n.x += n.vx
        n.y += n.vy
        n.pulse += 0.02
        if (n.x < 0 || n.x > W()) n.vx *= -1
        if (n.y < 0 || n.y > H()) n.vy *= -1
      })

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * opacity
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      nodes.forEach(n => {
        const pulseSize = n.size + Math.sin(n.pulse) * 0.8

        ctx.beginPath()
        ctx.arc(n.x, n.y, pulseSize * 3, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity * 0.3})`
        ctx.fill()

        ctx.beginPath()
        ctx.arc(n.x, n.y, pulseSize, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity * 2})`
        ctx.fill()
      })

      animId = requestAnimationFrame(draw)
    }

    animId = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [color, nodeCount, opacity])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  )
}
