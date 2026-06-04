import { useEffect } from 'react'

/**
 * Reveal-on-scroll observer for the animation utility classes:
 * `.fade-up`, `.slide-left`, `.slide-right`, `.scale-up`,
 * `.blur-reveal`, `.underline-grow`, `.section-divider`.
 *
 * Those classes are defined in src/index.css with `opacity: 0` (and a
 * transform). They only become visible once this observer adds the
 * `.visible` class. A page that renders ANY of those classes without
 * calling this hook (or being rendered inside a parent that does) shows
 * up completely blank. This has bitten Riyadh2027, Europe2026,
 * DealNetwork, and SoccerExpert. Always call this once per page that
 * uses the classes.
 *
 * Canonical config (most eager, safest against blank content): triggers
 * at 1% visibility and 200px before entering the viewport.
 *
 * @param {*} [dep] Optional dependency. Pass a value that changes when
 *   new animated elements are added to the DOM (e.g. a "show more"
 *   toggle, an async list length) so the observer re-scans for newly
 *   mounted elements. Omit entirely for static pages — the effect then
 *   runs exactly once.
 */
export function useScrollAnimations(dep) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.01, rootMargin: '0px 0px 200px 0px' }
    )

    document
      .querySelectorAll(
        '.fade-up, .slide-left, .slide-right, .scale-up, .blur-reveal, .underline-grow, .section-divider'
      )
      .forEach((el) => {
        if (!el.classList.contains('visible')) observer.observe(el)
      })

    return () => observer.disconnect()
  }, [dep])
}

export default useScrollAnimations
