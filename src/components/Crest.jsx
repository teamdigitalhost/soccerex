/**
 * Soccerex 30-year anniversary crest.
 *
 * Usage:
 *   <Crest variant="main"  color="white" size={140} />   // generic, white on dark
 *   <Crest variant="europe" color="black" size={96} />    // Europe-specific, black on light
 *   <Crest variant="miami" color="white" />               // Miami, default size 120
 *   <Crest variant="riyadh" color="white" size={60} />    // Riyadh
 *
 * `size` is the rendered height in px. Width is computed from the crest aspect.
 *
 * All 8 variants live under /public/brand/crests/ so they can be swapped by
 * dropping a new file in, no code change required.
 */

const CREST_ASPECT = 100 / 145.53 // width / height from the SVG viewBox

export default function Crest({
  variant = 'main',
  color = 'white',
  size = 120,
  className = '',
  style = {},
  alt,
  decorative = false,
}) {
  const src = `/brand/crests/crest-${variant}-${color}.svg`
  const width = Math.round(size * CREST_ASPECT)
  const defaultAlt = decorative
    ? ''
    : `Soccerex ${variant === 'main' ? '' : variant.charAt(0).toUpperCase() + variant.slice(1) + ' '}— Est. 1996, 30 Years`

  return (
    <img
      src={src}
      alt={alt ?? defaultAlt}
      className={className}
      style={{
        height: size,
        width,
        display: 'inline-block',
        flexShrink: 0,
        ...style,
      }}
      loading="lazy"
      aria-hidden={decorative ? true : undefined}
      draggable={false}
    />
  )
}
