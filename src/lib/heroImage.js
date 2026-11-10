/* Phone-size copies of the /hero/ photos live in /hero/sm/ as 960px WebP.
   The originals are 1920px JPEGs, about 10 MB each once decoded. iPhone
   Safari kills the tab ("A problem repeatedly occurred") when the slideshow
   and the galleries pile up enough of those, so small screens get the copies. */

const HERO_RE = /^\/hero\/([^/]+)\.(jpe?g|png|webp)$/i

export function heroSmall(src) {
  const m = HERO_RE.exec(src || '')
  return m ? `/hero/sm/${m[1]}.webp` : null
}

export function heroSrcSet(src) {
  const sm = heroSmall(src)
  return sm ? `${sm} 960w, ${src} 1920w` : undefined
}

export function isSmallScreen() {
  return typeof window !== 'undefined' && window.matchMedia('(max-width: 1024px)').matches
}

/* The slideshow sets a CSS background, which has no srcset. */
export function heroForViewport(src) {
  return (isSmallScreen() && heroSmall(src)) || src
}
