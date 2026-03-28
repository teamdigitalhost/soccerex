import { useEffect, useRef } from 'react'

export default function TopoDivider({ flip = false, color = '#09203e', bgColor = '#09203e', lineOnly = false }) {
  const svgRef = useRef(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const paths = svg.querySelectorAll('.topo-animated')
    let frame = 0
    let raf

    const configs = [
      { speed: 1.1, amp: 15, phase: 0, cy: [20, 40, 25, 35] },
      { speed: 0.7, amp: 12, phase: 1.7, cy: [30, 50, 35, 45] },
      { speed: 0.9, amp: 18, phase: 3.2, cy: [40, 55, 30, 50] },
      { speed: 1.3, amp: 10, phase: 5.1, cy: [50, 60, 45, 55] },
      { speed: 0.6, amp: 14, phase: 2.4, cy: [60, 70, 55, 65] },
      { speed: 1.0, amp: 16, phase: 4.0, cy: [25, 45, 20, 40] },
      { speed: 0.8, amp: 11, phase: 0.8, cy: [70, 78, 62, 72] },
    ]

    const animate = () => {
      frame += 0.008
      paths.forEach((path, i) => {
        const c = configs[i]
        if (!c) return
        const y1 = c.cy[0] + Math.sin(frame * c.speed + c.phase) * c.amp
        const y2 = c.cy[1] + Math.sin(frame * c.speed * 0.8 + c.phase + 1) * c.amp
        const y3 = c.cy[2] + Math.sin(frame * c.speed * 1.2 + c.phase + 2) * c.amp
        const y4 = c.cy[3] + Math.sin(frame * c.speed * 0.9 + c.phase + 3) * c.amp
        const isFill = path.classList.contains('topo-fill')
        path.setAttribute('d', isFill
          ? `M0,${y1} C300,${y2} 600,${y3} 900,${y4} L900,100 L0,100 Z`
          : `M0,${y1} C300,${y2} 600,${y3} 900,${y4}`
        )
      })
      raf = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(raf)
  }, [lineOnly])

  if (lineOnly) {
    return (
      <div className="relative w-full" style={{ height: 'clamp(60px, 8vw, 100px)', background: bgColor, zIndex: 5, marginTop: '-1px', marginBottom: '-1px' }}>
        <svg ref={svgRef} viewBox="0 0 900 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
          <path className="topo-animated" d="M0,20 C300,40 600,25 900,35" fill="none" stroke="rgba(191,177,112,0.4)" strokeWidth="1.8" />
          <path className="topo-animated" d="M0,30 C300,50 600,35 900,45" fill="none" stroke="rgba(191,177,112,0.25)" strokeWidth="1.2" />
          <path className="topo-animated" d="M0,40 C300,55 600,30 900,50" fill="none" stroke="rgba(26,63,191,0.15)" strokeWidth="0.9" />
          <path className="topo-animated" d="M0,50 C300,60 600,45 900,55" fill="none" stroke="rgba(191,177,112,0.2)" strokeWidth="0.7" />
          <path className="topo-animated" d="M0,60 C300,70 600,55 900,65" fill="none" stroke="rgba(26,63,191,0.12)" strokeWidth="0.6" />
          <path className="topo-animated" d="M0,25 C300,45 600,20 900,40" fill="none" stroke="rgba(191,177,112,0.08)" strokeWidth="1.4" />
          <path className="topo-animated" d="M0,70 C300,78 600,62 900,72" fill="none" stroke="rgba(26,63,191,0.06)" strokeWidth="0.5" />
        </svg>
      </div>
    )
  }

  return (
    <div className="relative w-full" style={{ marginTop: flip ? 0 : '-1px', marginBottom: flip ? '-1px' : 0, height: 'clamp(70px, 8vw, 110px)', zIndex: 5, background: bgColor }}>
      <svg
        ref={svgRef}
        viewBox="0 0 900 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
        style={{ transform: flip ? 'scaleY(-1)' : 'none' }}
      >
        <path className="topo-animated topo-fill" d="M0,20 C300,40 600,25 900,35 L900,100 L0,100 Z" fill={color} />
        <path className="topo-animated" d="M0,30 C300,50 600,35 900,45" fill="none" stroke="rgba(191,177,112,0.3)" strokeWidth="0.9" />
        <path className="topo-animated" d="M0,40 C300,55 600,30 900,50" fill="none" stroke="rgba(26,63,191,0.2)" strokeWidth="0.7" />
        <path className="topo-animated" d="M0,50 C300,60 600,45 900,55" fill="none" stroke="rgba(191,177,112,0.12)" strokeWidth="0.5" />
        <path className="topo-animated" d="M0,60 C300,70 600,55 900,65" fill="none" stroke="rgba(26,63,191,0.08)" strokeWidth="0.4" />
        <path className="topo-animated" d="M0,25 C300,45 600,20 900,40" fill="none" stroke="rgba(191,177,112,0.15)" strokeWidth="0.6" />
      </svg>
    </div>
  )
}
