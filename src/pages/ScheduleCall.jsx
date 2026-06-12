import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  CalendarCheck, CheckCircle2, Clock, Globe, Loader2, AlertTriangle, ArrowRight, User,
} from 'lucide-react'
import { getSchedulerAvailability, bookSchedulerSlot } from '../lib/soccerexApi'
import { CONTACT } from '../lib/routes'

/* Public sales-call booking page.
 *
 * Each salesperson shares a personal link (/schedule/{code}). The page:
 *   1. Loads availability (no auth) via GET /scheduler/{code}/availability
 *   2. Lets the visitor pick a day (chip row), then a time slot, then fill
 *      a short contact form and confirm.
 *   3. POSTs /scheduler/{code}/book. A 409 means the slot was taken in the
 *      meantime — we refresh availability and ask for another time.
 *
 * Brand palette mirrors DealNetwork.jsx: navy #09203e on cream/white, gold
 * var(--color-brand-accent) for the selected slot + confirm CTA.
 */

const NAVY = '#09203e'
const NAVY_DEEP = '#050d1a'

export default function ScheduleCall() {
  const { code } = useParams()
  const [state, setState] = useState('loading') // 'loading' | 'ready' | 'invalid' | 'error'
  const [availability, setAvailability] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null) // 'YYYY-MM-DD'
  const [selectedSlot, setSelectedSlot] = useState(null) // { start, label }
  const [form, setForm] = useState({ name: '', email: '', company: '', notes: '' })
  const [submitting, setSubmitting] = useState(false)
  const [bookError, setBookError] = useState('')
  const [booked, setBooked] = useState(null) // { starts_at, ends_at, timezone, salesperson_name }

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = 'Book a call — Soccerex'
    }
  }, [])

  const loadAvailability = useCallback(async ({ keepSelection = false } = {}) => {
    try {
      const data = await getSchedulerAvailability(code)
      setAvailability(data)
      const days = Array.isArray(data?.days) ? data.days : []
      setSelectedDate((prev) => {
        const stillThere = keepSelection && days.some((d) => d.date === prev && d.slots?.length)
        if (stillThere) return prev
        const firstOpen = days.find((d) => d.slots?.length)
        return firstOpen ? firstOpen.date : null
      })
      setState('ready')
      return true
    } catch (err) {
      setState(err?.status === 404 ? 'invalid' : 'error')
      return false
    }
  }, [code])

  useEffect(() => {
    let cancelled = false
    setState('loading')
    loadAvailability().then(() => { if (cancelled) return })
    return () => { cancelled = true }
  }, [loadAvailability])

  // The backend already limits the window; cap at ~14 days defensively.
  const days = useMemo(
    () => (Array.isArray(availability?.days) ? availability.days.slice(0, 14) : []),
    [availability],
  )
  const activeDay = days.find((d) => d.date === selectedDate) || null

  function pickDay(date) {
    setSelectedDate(date)
    setSelectedSlot(null)
    setBookError('')
  }

  function pickSlot(slot) {
    setSelectedSlot(slot)
    setBookError('')
  }

  async function handleConfirm(e) {
    e.preventDefault()
    if (!selectedSlot || submitting) return
    const name = form.name.trim()
    const email = form.email.trim()
    if (!name || !email) {
      setBookError('Please add your name and email so we can confirm the call.')
      return
    }
    setSubmitting(true)
    setBookError('')
    try {
      const res = await bookSchedulerSlot(code, {
        start: selectedSlot.start,
        name,
        email,
        ...(form.company.trim() ? { company: form.company.trim() } : {}),
        ...(form.notes.trim() ? { notes: form.notes.trim() } : {}),
      })
      setBooked(res)
    } catch (err) {
      if (err?.status === 409) {
        // Slot raced away between availability fetch and submit.
        setSelectedSlot(null)
        setBookError('Sorry — that time was just taken. Please pick another slot.')
        await loadAvailability({ keepSelection: true })
      } else if (err?.status === 404) {
        setState('invalid')
      } else {
        setBookError(err?.message || 'We could not book the call. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const heroSubtitle = availability
    ? `with ${availability.salesperson_name} · ${availability.duration_minutes} minutes · times shown in ${availability.timezone}`
    : null

  return (
    <div style={{ background: '#f4f3f0', minHeight: '100vh' }}>

      {/* ═══ DARK HERO STRIP ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: NAVY_DEEP }}>
        <div className="absolute inset-0" style={{
          background: `radial-gradient(ellipse at top, #0d2b52 0%, ${NAVY_DEEP} 75%)`,
        }} />
        <div className="relative z-10 text-center mx-auto" style={{
          maxWidth: 760, padding: 'clamp(48px,6vw,80px) clamp(20px,4vw,40px) clamp(40px,5vw,64px)',
        }}>
          <div className="flex justify-center mb-6">
            <img src="/brand/crests/crest-main-white.svg" alt="Soccerex"
              style={{ height: 48, filter: 'drop-shadow(0 8px 40px rgba(233,30,99,0.3))' }} />
          </div>
          <p className="section-label text-white mb-4" style={{ opacity: 0.85 }}>SOCCEREX</p>
          <h1 className="font-heading font-bold text-white leading-[1.1]"
              style={{ fontSize: 'clamp(1.9rem, 4.5vw, 3rem)', marginBottom: 12 }}>
            Book a call
          </h1>
          {heroSubtitle && (
            <p className="font-body text-white/80" style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.05rem)', lineHeight: 1.55 }}>
              {heroSubtitle}
            </p>
          )}
        </div>
      </section>

      {/* ═══ LIGHT CONTENT ═════════════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(36px,5vw,64px) clamp(16px,4vw,40px) clamp(64px,7vw,100px)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          {state === 'loading' && <LoadingCard />}
          {state === 'invalid' && <InvalidLinkCard />}
          {state === 'error' && <ErrorCard onRetry={() => { setState('loading'); loadAvailability() }} />}

          {state === 'ready' && booked && <BookedCard booked={booked} />}

          {state === 'ready' && !booked && (
            <div style={{
              background: '#fff', borderRadius: 16, padding: 'clamp(22px,3.5vw,36px)',
              border: '1px solid rgba(9,32,62,0.08)', boxShadow: '0 6px 24px rgba(9,32,62,0.06)',
            }}>
              {/* Day selector: horizontal scroll chips */}
              <SectionLabel step="1" text="Pick a day" />
              <div className="flex gap-2" style={{ overflowX: 'auto', paddingBottom: 10, marginBottom: 22, WebkitOverflowScrolling: 'touch' }}>
                {days.map((day) => {
                  const hasSlots = (day.slots || []).length > 0
                  const active = day.date === selectedDate
                  return (
                    <button
                      key={day.date}
                      type="button"
                      disabled={!hasSlots}
                      onClick={() => pickDay(day.date)}
                      className="font-body font-semibold"
                      style={{
                        flexShrink: 0, padding: '10px 16px', borderRadius: 999,
                        fontSize: '0.82rem', cursor: hasSlots ? 'pointer' : 'not-allowed',
                        background: active ? NAVY : '#fff',
                        color: active ? '#fff' : (hasSlots ? NAVY : '#b3bcc5'),
                        border: active ? `1.5px solid ${NAVY}` : '1.5px solid rgba(9,32,62,0.18)',
                        opacity: hasSlots ? 1 : 0.55,
                        transition: 'background 0.15s ease, color 0.15s ease',
                      }}
                    >
                      {day.label}
                    </button>
                  )
                })}
                {days.length === 0 && (
                  <p className="font-body" style={{ fontSize: '0.92rem', color: '#586778' }}>
                    No times are currently open. Please check back soon.
                  </p>
                )}
              </div>

              {/* Slot grid for the chosen day */}
              {activeDay && (
                <>
                  <SectionLabel step="2" text="Pick a time" />
                  <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))',
                    gap: 10, marginBottom: 26,
                  }}>
                    {(activeDay.slots || []).map((slot) => {
                      const selected = selectedSlot?.start === slot.start
                      return (
                        <button
                          key={slot.start}
                          type="button"
                          onClick={() => pickSlot(slot)}
                          className="font-body font-semibold"
                          style={{
                            padding: '12px 8px', borderRadius: 8, fontSize: '0.9rem', cursor: 'pointer',
                            background: selected ? 'var(--color-brand-accent)' : '#fafaf7',
                            color: NAVY,
                            border: selected ? `2px solid ${NAVY}` : '1.5px solid rgba(9,32,62,0.15)',
                            boxShadow: selected ? '0 6px 16px rgba(9,32,62,0.18)' : 'none',
                            transition: 'background 0.15s ease, box-shadow 0.15s ease',
                          }}
                        >
                          {slot.label}
                        </button>
                      )
                    })}
                  </div>
                </>
              )}

              {/* Contact form, shown once a slot is picked */}
              {selectedSlot && activeDay && (
                <form onSubmit={handleConfirm}>
                  <SectionLabel step="3" text="Your details" />
                  <div style={{
                    background: 'rgba(191,177,112,0.14)', border: '1px solid rgba(191,177,112,0.45)',
                    borderRadius: 10, padding: '12px 16px', marginBottom: 18,
                    display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
                  }}>
                    <CalendarCheck size={17} color={NAVY} />
                    <span className="font-body font-semibold" style={{ fontSize: '0.92rem', color: NAVY }}>
                      {activeDay.label} at {selectedSlot.label}
                    </span>
                    <span className="font-body" style={{ fontSize: '0.82rem', color: '#586778' }}>
                      · {availability.duration_minutes} min · {availability.timezone}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" style={{ marginBottom: 12 }}>
                    <Field label="Name *">
                      <input type="text" required value={form.name} autoComplete="name"
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        style={inputStyle} placeholder="Your full name" />
                    </Field>
                    <Field label="Email *">
                      <input type="email" required value={form.email} autoComplete="email"
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        style={inputStyle} placeholder="you@company.com" />
                    </Field>
                  </div>
                  <Field label="Company" style={{ marginBottom: 12 }}>
                    <input type="text" value={form.company} autoComplete="organization"
                      onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                      style={inputStyle} placeholder="Company or organisation (optional)" />
                  </Field>
                  <Field label="Notes" style={{ marginBottom: 18 }}>
                    <textarea rows={3} value={form.notes}
                      onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                      style={{ ...inputStyle, resize: 'vertical' }}
                      placeholder="Anything you'd like to cover on the call (optional)" />
                  </Field>

                  {bookError && (
                    <div style={{
                      background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)',
                      borderRadius: 10, padding: '12px 14px', marginBottom: 16,
                      display: 'flex', alignItems: 'flex-start', gap: 10,
                    }}>
                      <AlertTriangle size={16} color="#dc2626" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span className="font-body" style={{ fontSize: '0.88rem', color: '#991b1b', lineHeight: 1.5 }}>{bookError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center gap-2 font-body font-semibold uppercase tracking-[0.15em]"
                    style={{
                      background: 'var(--color-brand-accent)', color: NAVY,
                      padding: '16px 24px', fontSize: '0.82rem', border: 'none',
                      cursor: submitting ? 'wait' : 'pointer', borderRadius: 8,
                      opacity: submitting ? 0.7 : 1,
                    }}
                  >
                    {submitting
                      ? <><Loader2 size={16} className="animate-spin" /> Booking…</>
                      : <>Confirm booking <ArrowRight size={16} /></>}
                  </button>
                </form>
              )}

              {/* 409 message can also fire while no slot is selected (we clear it) */}
              {!selectedSlot && bookError && (
                <div style={{
                  background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: 10, padding: '12px 14px', marginTop: 4,
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                }}>
                  <AlertTriangle size={16} color="#dc2626" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span className="font-body" style={{ fontSize: '0.88rem', color: '#991b1b', lineHeight: 1.5 }}>{bookError}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

const inputStyle = {
  width: '100%', padding: '12px 14px', borderRadius: 8,
  border: '1.5px solid rgba(9,32,62,0.15)', background: '#fafaf7',
  fontSize: '0.92rem', color: NAVY, outline: 'none',
  fontFamily: 'inherit',
}

function SectionLabel({ step, text }) {
  return (
    <p className="font-mono uppercase tracking-[0.18em]" style={{
      fontSize: '0.68rem', color: 'var(--color-brand-accent)', fontWeight: 700, marginBottom: 12,
    }}>
      {step} · {text}
    </p>
  )
}

function Field({ label, style, children }) {
  return (
    <label className="block" style={style}>
      <span className="font-body block" style={{ fontSize: '0.78rem', fontWeight: 600, color: NAVY, marginBottom: 6 }}>{label}</span>
      {children}
    </label>
  )
}

/* Format the confirmed start time in the salesperson's timezone. Falls back
   to the raw ISO string if Intl rejects the timezone identifier. */
function formatBookedDate(iso, timezone) {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      timeZone: timezone || undefined,
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

function formatBookedTime(iso, timezone) {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit', minute: '2-digit', hour12: false,
      timeZone: timezone || undefined,
    }).format(new Date(iso))
  } catch {
    return ''
  }
}

function BookedCard({ booked }) {
  const date = formatBookedDate(booked.starts_at, booked.timezone)
  const start = formatBookedTime(booked.starts_at, booked.timezone)
  const end = formatBookedTime(booked.ends_at, booked.timezone)
  return (
    <div style={{
      background: '#fff', borderRadius: 16, padding: 'clamp(28px,4vw,44px)',
      border: '1px solid rgba(9,32,62,0.08)', boxShadow: '0 6px 24px rgba(9,32,62,0.06)',
      textAlign: 'center',
    }}>
      <div style={{
        width: 60, height: 60, borderRadius: '50%', background: 'rgba(34,197,94,0.12)',
        display: 'grid', placeItems: 'center', margin: '0 auto 20px',
      }}>
        <CheckCircle2 size={30} color="#16a34a" />
      </div>
      <h2 className="font-heading font-bold" style={{ fontSize: 'clamp(1.5rem, 3vw, 1.9rem)', color: NAVY, marginBottom: 10 }}>
        Booked
      </h2>
      <p className="font-body" style={{ fontSize: '1rem', color: '#586778', lineHeight: 1.6, marginBottom: 22 }}>
        Your call with <strong style={{ color: NAVY }}>{booked.salesperson_name}</strong> is confirmed.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left" style={{ marginBottom: 22 }}>
        <BookedStat icon={CalendarCheck} label="Date" value={date} />
        <BookedStat icon={Clock} label="Time" value={end ? `${start} – ${end}` : start} />
        <BookedStat icon={Globe} label="Timezone" value={booked.timezone} />
      </div>

      <div className="inline-flex items-center gap-2 font-body" style={{ fontSize: '0.9rem', color: '#586778' }}>
        <User size={15} color="var(--color-brand-accent)" />
        A confirmation email with the call details is on its way to your inbox.
      </div>
    </div>
  )
}

function BookedStat({ icon: Icon, label, value }) {
  return (
    <div style={{ background: '#fafaf7', borderRadius: 10, padding: '14px 16px', border: '1px solid rgba(9,32,62,0.08)' }}>
      <div className="flex items-center gap-2 mb-1">
        <Icon size={14} color="var(--color-brand-accent)" strokeWidth={2.2} />
        <span className="text-[10px] uppercase tracking-wide text-gray-500">{label}</span>
      </div>
      <div className="font-heading font-semibold" style={{ fontSize: '0.95rem', color: NAVY }}>{value}</div>
    </div>
  )
}

function LoadingCard() {
  return (
    <div style={{
      background: '#fff', borderRadius: 16, padding: '56px 32px', textAlign: 'center',
      border: '1px solid rgba(9,32,62,0.08)', boxShadow: '0 6px 24px rgba(9,32,62,0.06)',
    }}>
      <Loader2 className="inline-block animate-spin" size={28} style={{ color: NAVY }} />
      <p className="font-body mt-4" style={{ color: '#586778' }}>Loading available times…</p>
    </div>
  )
}

function InvalidLinkCard() {
  return (
    <div style={{
      background: '#fff', borderRadius: 16, padding: 'clamp(28px,4vw,44px)', textAlign: 'center',
      border: '1px solid rgba(9,32,62,0.08)', boxShadow: '0 6px 24px rgba(9,32,62,0.06)',
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: '50%', background: 'rgba(9,32,62,0.08)',
        display: 'grid', placeItems: 'center', margin: '0 auto 20px',
      }}>
        <AlertTriangle size={28} color={NAVY} />
      </div>
      <h2 className="font-heading font-bold" style={{ fontSize: '1.4rem', color: NAVY, marginBottom: 10 }}>
        This scheduling link is not active
      </h2>
      <p className="font-body" style={{ fontSize: '0.95rem', color: '#586778', lineHeight: 1.6, marginBottom: 24, maxWidth: 460, marginLeft: 'auto', marginRight: 'auto' }}>
        The link may have expired or been switched off. Reach out and we will set up the call another way.
      </p>
      <Link to={CONTACT} className="inline-block font-body font-semibold uppercase tracking-[0.15em]"
        style={{ background: NAVY, color: '#fff', padding: '14px 28px', fontSize: '0.78rem', textDecoration: 'none', borderRadius: 4 }}>
        Contact the Soccerex team
      </Link>
    </div>
  )
}

function ErrorCard({ onRetry }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 16, padding: 'clamp(28px,4vw,44px)', textAlign: 'center',
      border: '1px solid rgba(9,32,62,0.08)', boxShadow: '0 6px 24px rgba(9,32,62,0.06)',
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: '50%', background: 'rgba(239,68,68,0.12)',
        display: 'grid', placeItems: 'center', margin: '0 auto 20px',
      }}>
        <AlertTriangle size={28} color="#dc2626" />
      </div>
      <h2 className="font-heading font-bold" style={{ fontSize: '1.4rem', color: NAVY, marginBottom: 10 }}>
        We could not load the available times
      </h2>
      <p className="font-body" style={{ fontSize: '0.95rem', color: '#586778', lineHeight: 1.6, marginBottom: 24 }}>
        Please check your connection and try again.
      </p>
      <button type="button" onClick={onRetry}
        className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.15em]"
        style={{ background: NAVY, color: '#fff', padding: '14px 28px', fontSize: '0.78rem', border: 'none', cursor: 'pointer', borderRadius: 4 }}>
        Try again
      </button>
    </div>
  )
}
