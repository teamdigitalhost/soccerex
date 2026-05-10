import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { FlaskConical } from 'lucide-react'

/**
 * Global banner shown when ?test=1 is present in the URL.
 *
 * Also injects <meta name="robots" content="noindex, nofollow"> while test
 * mode is active so search engines don't index evaluation/test data pages.
 * The meta tag is removed cleanly when the user navigates away.
 */
export default function TestModeBanner() {
  const location = useLocation()
  const [isTest, setIsTest] = useState(false)

  useEffect(() => {
    const active = new URLSearchParams(location.search).get('test') === '1'
    setIsTest(active)

    if (!active) return undefined

    /* Inject (or update) the robots noindex meta while test mode is on. */
    const TAG_ID = 'test-mode-robots'
    let tag = document.getElementById(TAG_ID)
    if (!tag) {
      tag = document.createElement('meta')
      tag.id = TAG_ID
      tag.name = 'robots'
      document.head.appendChild(tag)
    }
    tag.setAttribute('content', 'noindex, nofollow')

    return () => {
      const existing = document.getElementById(TAG_ID)
      if (existing) existing.remove()
    }
  }, [location.search])

  if (!isTest) return null

  return (
    <div role="status" aria-live="polite" style={{
      position: 'sticky', top: 0, zIndex: 60,
      background: '#FFB46A',
      color: '#0D1B2A',
      borderBottom: '1px solid rgba(13, 27, 42, 0.18)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: 10,
      padding: '8px 16px',
      fontFamily: "'Inter', sans-serif",
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
    }}>
      <FlaskConical size={14} aria-hidden="true" />
      Test data mode
      <span style={{ fontWeight: 500, letterSpacing: '0.04em', textTransform: 'none', opacity: 0.8 }}>
        — drop <code style={{ background: 'rgba(13,27,42,0.12)', padding: '1px 6px', borderRadius: 4 }}>?test=1</code> from the URL to see production data
      </span>
    </div>
  )
}
