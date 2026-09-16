import { useEffect, useRef, useState } from 'react'

/**
 * Medium-style applause pill: tap as many times as you like, claps batch
 * locally and flush to the API ~700ms after the last tap (and on unmount, so
 * navigating away mid-applause loses nothing). Shared by the agenda concept
 * topics, the panels on the agenda, and the speaker cards.
 *
 * A pill showing only an emoji and a number does not say what tapping it does,
 * so hovering or tabbing to it names the action straight away. The hint is
 * rendered on hover rather than faded in, so it arrives with the cursor instead
 * of a second later like a browser title attribute.
 *
 * Props:
 *   initial  — server-side count to start from
 *   onFlush  — (count) => Promise resolving { claps } with the new total
 *   ariaLabel, idleLabel — accessibility + the zero-claps call to action
 *   tooltip  — the hover hint
 */
export default function ClapButton({
  initial = 0,
  onFlush,
  ariaLabel = 'Clap for this',
  idleLabel = 'Clap for this',
  tooltip = 'Clap for this',
}) {
  const [claps, setClaps] = useState(initial)
  const [bump, setBump] = useState(false)
  const [hint, setHint] = useState(false)
  const pending = useRef(0)
  const timer = useRef(null)
  const flushRef = useRef(onFlush)
  useEffect(() => { flushRef.current = onFlush }, [onFlush])

  const flush = () => {
    const n = pending.current
    pending.current = 0
    if (n > 0) {
      flushRef.current(n)
        .then((r) => { if (r && typeof r.claps === 'number') setClaps(r.claps) })
        .catch(() => {})
    }
  }

  // Don't lose un-sent claps if they navigate away mid-applause.
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
    if (pending.current > 0) flushRef.current(pending.current).catch(() => {})
  }, [])

  const clap = (e) => {
    // The speaker card wraps the whole tile in a <Link>; applause must never navigate.
    e.preventDefault()
    e.stopPropagation()
    setClaps((c) => c + 1)
    pending.current += 1
    setBump(true)
    setTimeout(() => setBump(false), 160)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(flush, 700)
  }

  return (
    <span style={{ position: 'relative', display: 'inline-flex' }}>
      {hint && (
        <span
          role="tooltip"
          style={{
            position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
            marginBottom: 8, padding: '5px 10px', borderRadius: 4,
            background: '#0D1B2A', color: '#FFFFFF', whiteSpace: 'nowrap',
            fontFamily: 'Montserrat, sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '0.04em',
            boxShadow: '0 4px 14px rgba(13,27,42,0.22)', pointerEvents: 'none', zIndex: 30,
          }}
        >
          {tooltip}
          <span aria-hidden style={{
            position: 'absolute', top: '100%', left: '50%', marginLeft: -4,
            width: 0, height: 0,
            borderLeft: '4px solid transparent', borderRight: '4px solid transparent',
            borderTop: '4px solid #0D1B2A',
          }} />
        </span>
      )}

      <button type="button" onClick={clap} aria-label={ariaLabel}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          padding: '6px 13px', borderRadius: 999, cursor: 'pointer',
          border: '1px solid rgba(13,27,42,0.12)', background: '#fff',
          fontFamily: 'Montserrat, sans-serif', fontSize: 12.5, fontWeight: 600, color: '#3a4a5a',
          transition: 'border-color .15s, box-shadow .15s',
        }}
        onMouseEnter={(e) => { setHint(true); e.currentTarget.style.borderColor = 'var(--event-primary)'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(13,27,42,0.08)' }}
        onMouseLeave={(e) => { setHint(false); e.currentTarget.style.borderColor = 'rgba(13,27,42,0.12)'; e.currentTarget.style.boxShadow = 'none' }}
        onFocus={() => setHint(true)}
        onBlur={() => setHint(false)}
        /* A tap leaves no cursor to move away, so the hint would stick. */
        onPointerDown={(e) => { if (e.pointerType !== 'mouse') setHint(false) }}
      >
        <span style={{ fontSize: 15, display: 'inline-block', transform: bump ? 'scale(1.35) rotate(-8deg)' : 'scale(1)', transition: 'transform .16s' }}>👏</span>
        {claps > 0 ? <span style={{ fontVariantNumeric: 'tabular-nums' }}>{claps.toLocaleString()}</span> : <span>{idleLabel}</span>}
      </button>
    </span>
  )
}
