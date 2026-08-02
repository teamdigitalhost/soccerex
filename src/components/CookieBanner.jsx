import { useState } from 'react'
import { Link } from 'react-router-dom'
import { COOKIE_POLICY } from '../lib/routes'
import { getConsent, setConsent, loadAnalytics } from '../lib/analytics'

export default function CookieBanner() {
  const [visible, setVisible] = useState(() => getConsent() === null)

  if (!visible) return null

  function accept() {
    setConsent('accepted')
    loadAnalytics()
    setVisible(false)
  }

  function decline() {
    setConsent('declined')
    setVisible(false)
  }

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9000,
        background: '#09203e',
        borderTop: '1px solid rgba(255,255,255,0.10)',
        padding: '14px 20px',
        display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '12px',
        fontFamily: "'Inter', sans-serif",
        fontSize: 13,
        color: 'rgba(255,255,255,0.85)',
      }}
    >
      <p style={{ margin: 0, flex: '1 1 280px', lineHeight: 1.5 }}>
        We use analytics cookies (Google Analytics 4 and LinkedIn Insight Tag) to measure site
        performance and build retargeting audiences. First-party cookies are always active.{' '}
        <Link
          to={COOKIE_POLICY}
          style={{ color: '#ff5b8a', textDecoration: 'underline', whiteSpace: 'nowrap' }}
        >
          Cookie Policy
        </Link>
      </p>
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <button
          onClick={accept}
          style={{
            background: '#E91E63', color: '#fff', border: 'none', borderRadius: 6,
            padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Accept
        </button>
        <button
          onClick={decline}
          style={{
            background: 'transparent', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: 6, padding: '8px 18px', fontSize: 13, fontWeight: 500, cursor: 'pointer',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Decline
        </button>
      </div>
    </div>
  )
}
