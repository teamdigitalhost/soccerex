/* Pinned event-day mode toggle. Imported by PersonalPortal + CompanyPortal
   so both portals share the same UX language for "what matters right now". */
export default function EventDayToggle({ on, onChange, label = 'Event-day focus' }) {
  const toggle = () => onChange(! on)
  const handleKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault()
      toggle()
    }
  }
  return (
    <div
      role="switch"
      aria-checked={on}
      aria-label={on ? `${label} is on. Press to show the full portal.` : `Press to enable ${label}.`}
      tabIndex={0}
      onClick={toggle}
      onKeyDown={handleKey}
      style={{
        cursor: 'pointer',
        background: on ? 'linear-gradient(135deg, #0D1B2A 0%, #1f3f6d 100%)' : '#FFFFFF',
        color: on ? '#FFFFFF' : '#0D1B2A',
        border: '1px solid ' + (on ? '#0D1B2A' : 'rgba(13,27,42,0.18)'),
        padding: '12px 16px',
        marginBottom: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        outline: 'none',
      }}
      onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 3px rgba(13,27,42,0.18)' }}
      onBlur={(e) => { e.currentTarget.style.boxShadow = 'none' }}
    >
      <div aria-hidden="true" style={{
        width: 36, height: 20, borderRadius: 20,
        background: on ? 'rgba(255,255,255,0.3)' : 'rgba(13,27,42,0.18)',
        position: 'relative', transition: 'background 0.2s', flexShrink: 0,
      }}>
        <div style={{
          width: 16, height: 16, borderRadius: '50%',
          background: '#fff', position: 'absolute', top: 2,
          left: on ? 18 : 2, transition: 'left 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
        }} />
      </div>
      <div style={{ flex: 1 }}>
        <div className="miami-headline" style={{ fontSize: 14, lineHeight: 1.2 }}>
          {on ? `${label}: showing today + this week only` : label}
        </div>
        <div className="miami-body" style={{ fontSize: 11, opacity: 0.75, marginTop: 2 }}>
          {on ? 'Tap to show full portal.' : 'Tap to focus on what matters this week.'}
        </div>
      </div>
    </div>
  )
}
