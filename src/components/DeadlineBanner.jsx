import { Clock } from 'lucide-react'

// Commercial deadlines. EMPTY on purpose (Joel, 2026-08-19): the previous
// entries did not reflect the actual commercial offer, and a countdown that
// is not true poisons every real one that follows. Only add a deadline here
// when Joel or sales confirms it as actual policy; the banner disappears
// everywhere while this list is empty.
const MIAMI_DEADLINES = []

function daysUntil(isoDate) {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const deadline = new Date(isoDate + 'T00:00:00')
  return Math.round((deadline - now) / 86400000)
}

function formatDeadlineDate(isoDate) {
  const d = new Date(isoDate + 'T00:00:00')
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'long' })
}

function urgencyText(days, label, isoDate) {
  if (days <= 0) return `TODAY: ${label}`
  if (days === 1) return `1 DAY LEFT: ${label}`
  return `${days} DAYS LEFT: ${label} ${formatDeadlineDate(isoDate)}`
}

// variant: 'sponsor' shows the headline-partner deadline,
//          'exhibit' shows the floor-stand deadline,
//          'general' shows the nearest upcoming deadline.
export default function DeadlineBanner({ variant = 'general' }) {
  let deadline
  if (variant === 'exhibit') {
    deadline = MIAMI_DEADLINES[1]
  } else if (variant === 'sponsor') {
    deadline = MIAMI_DEADLINES[0]
  } else {
    deadline = MIAMI_DEADLINES.find((d) => daysUntil(d.date) >= 0) ?? null
  }

  if (!deadline) return null

  const days = daysUntil(deadline.date)
  const isVeryUrgent = days <= 3

  return (
    <div
      className="inline-flex items-center gap-2.5"
      style={{
        background: isVeryUrgent ? 'rgba(233,30,99,0.9)' : 'rgba(233,30,99,0.15)',
        border: `1px solid ${isVeryUrgent ? 'rgba(233,30,99,0.9)' : 'rgba(233,30,99,0.45)'}`,
        padding: '9px 16px',
      }}
    >
      <Clock
        size={13}
        style={{ color: isVeryUrgent ? '#fff' : '#E91E63', flexShrink: 0 }}
        aria-hidden
      />
      <span
        className="miami-subhead"
        style={{
          fontSize: 11,
          letterSpacing: '0.15em',
          color: isVeryUrgent ? '#fff' : '#ff6fa0',
          fontWeight: 700,
        }}
      >
        {urgencyText(days, deadline.label.toUpperCase(), deadline.date)}
      </span>
    </div>
  )
}
