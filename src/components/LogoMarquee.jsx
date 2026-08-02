export default function LogoMarquee({ logos, direction = 'left', speed = 30, invert = true, height = 50 }) {
  const tripled = [...logos, ...logos, ...logos]
  return (
    <div className="overflow-hidden" style={{
      maskImage: 'linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)',
      WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)',
    }}>
      <div
        className="flex items-center"
        style={{
          gap: `clamp(40px, 6vw, 80px)`,
          animation: `marquee-${direction} ${speed}s linear infinite`,
          width: 'max-content',
        }}
      >
        {tripled.map((logo, i) => (
          <img
            key={`${logo.alt}-${i}`}
            src={logo.src}
            alt={logo.alt}
            loading="lazy"
            style={{ height: `${height}px`, width: 'auto', objectFit: 'contain', filter: invert ? 'grayscale(1) brightness(0) invert(1)' : 'none', opacity: invert ? 0.5 : 0.8 }}
          />
        ))}
      </div>
    </div>
  )
}
