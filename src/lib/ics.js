/**
 * Minimal client-side iCalendar (.ics) generator.
 *
 * Public APIs:
 *   buildIcs({ uid, title, description, location, start, end, url })
 *   downloadIcs(icsString, filename)
 *
 * The ICS spec requires CRLF line endings and a few escaping rules for
 * commas/semicolons/newlines in text fields. Times are written in UTC
 * (Z-suffixed) so we don't have to ship a VTIMEZONE block. Input dates can
 * be ISO strings or Date instances.
 */

function pad(n) { return String(n).padStart(2, '0') }

function toIcsDate(value, { allDay = false } = {}) {
  if (!value) return null
  const d = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(d.getTime())) return null
  if (allDay) {
    return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}`
  }
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
}

function escapeText(s) {
  if (s == null) return ''
  return String(s)
    .replace(/\\/g, '\\\\')
    .replace(/\r?\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
}

/* RFC 5545 §3.1: content lines must not exceed 75 octets. Long lines are
   folded by inserting CRLF + a single whitespace before any continuation.
   We measure octets (UTF-8 byte length) rather than code points so unicode
   summary/description fields don't push past the limit silently. */
function foldLine(line) {
  const encoder = typeof TextEncoder !== 'undefined' ? new TextEncoder() : null
  const byteLength = (s) => encoder ? encoder.encode(s).length : s.length
  if (byteLength(line) <= 75) return line
  const out = []
  let buf = ''
  let bufBytes = 0
  for (const ch of line) {
    const chBytes = encoder ? encoder.encode(ch).length : 1
    /* Reserve 1 octet of headroom so a multibyte char never crosses the
       boundary mid-character. */
    if (bufBytes + chBytes > 74) {
      out.push(buf)
      buf = ch
      bufBytes = chBytes
    } else {
      buf += ch
      bufBytes += chBytes
    }
  }
  if (buf) out.push(buf)
  return out.join('\r\n ') /* CRLF + leading SPACE per the fold spec */
}

export function buildIcs({ uid, title, description, location, start, end, url } = {}) {
  if (!start) throw new Error('buildIcs: start is required')
  const dtStart = toIcsDate(start)
  /* Default to a one-hour event if no end is supplied */
  const dtEnd   = toIcsDate(end || new Date(new Date(start).getTime() + 60 * 60 * 1000))
  const stamp   = toIcsDate(new Date())
  const safeUid = (uid || `${Date.now()}-${Math.random().toString(36).slice(2)}@soccerex`).replace(/[^a-zA-Z0-9@._-]/g, '-')

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Soccerex//Frontend//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${safeUid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${escapeText(title || 'Soccerex event')}`,
  ]
  if (description) lines.push(`DESCRIPTION:${escapeText(description)}`)
  if (location)    lines.push(`LOCATION:${escapeText(location)}`)
  if (url)         lines.push(`URL:${escapeText(url)}`)
  lines.push('END:VEVENT', 'END:VCALENDAR')
  return lines.map(foldLine).join('\r\n')
}

export function downloadIcs(ics, filename = 'event.ics') {
  if (typeof window === 'undefined' || typeof document === 'undefined') return
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
