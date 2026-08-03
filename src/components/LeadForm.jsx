import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Send, Loader2, Check, AlertCircle, ArrowRight, ArrowLeft, CalendarClock, Download } from 'lucide-react'
import { submitLead, ApiError } from '../lib/soccerexApi'
import { isTestModeFromUrl } from '../lib/testMode'

/**
 * LeadForm — single low-friction form component used by every public lead
 * intake on the site. Fields are conditional, optionally multi-step, and
 * the success state is intentionally generic ("we'll be in touch") so the
 * backend can route to whichever automation rule applies.
 *
 * Props:
 *   kind:           'contact' | 'newsletter' | 'sponsorship-inquiry' |
 *                   'speaker-inquiry' | 'preregister'
 *   schema:         array of step descriptors:
 *                     [{ fields: [{ name, label, type?, required?, placeholder?,
 *                                   options?, hint?, autoFocus?, span?, validate? }] }]
 *                   For a single-step form pass one step. For a multi-step
 *                   form pass multiple — the component renders Back/Next.
 *   extraPayload:   object merged into every submission (e.g. event_slug,
 *                   attendee_type, source).
 *   submitLabel:    override the submit button label.
 *   successTitle:   override the success-state heading.
 *   successBody:    override the success-state body copy.
 *   bookingUrl:     fallback "Book a call now" target for the success state
 *                   (see lib/routes bookCallUrl). If the submit response
 *                   carries a booking_url (the assigned rep's link, once the
 *                   backend returns it), that wins over this fallback.
 *   children:       extra success-state content rendered under the CTA
 *                   (e.g. a deck download once assets exist).
 *   theme:          'dark' | 'light' — selects input/button styling.
 *
 * The backend accepts US-spelled aliases (organization vs organisation,
 * company vs organisation, name vs full_name); the form posts whatever the
 * `name` field is set to in the schema, so callers control wire format.
 */
export default function LeadForm({
  kind,
  schema,
  extraPayload = {},
  submitLabel,
  successTitle,
  successBody,
  bookingUrl,
  children,
  theme = 'light',
}) {
  const steps = Array.isArray(schema) ? schema : []
  const [stepIndex, setStepIndex] = useState(0)
  const [values, setValues] = useState({})
  const [status, setStatus] = useState('idle')
  const [errors, setErrors] = useState({})
  const [topError, setTopError] = useState('')
  /* The assigned rep's booking link, when the intake response provides one.
     Not returned by the backend yet — wired so the success CTA upgrades from
     the generic fallback to the assigned rep the day lead assignment ships. */
  const [assignedBookingUrl, setAssignedBookingUrl] = useState(null)
  const [packDownloadUrl, setPackDownloadUrl] = useState(null)

  const totalSteps = steps.length
  const isLastStep = stepIndex === totalSteps - 1
  const isMultiStep = totalSteps > 1
  const step = steps[stepIndex] || { fields: [] }

  const update = (name) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setValues((prev) => ({ ...prev, [name]: v }))
    if (errors[name]) setErrors((prev) => { const next = { ...prev }; delete next[name]; return next })
  }

  const validateStep = () => {
    const next = {}
    for (const field of step.fields) {
      if (field.requires && !shouldShow(field, values)) continue
      if (field.required && !String(values[field.name] || '').trim()) {
        next[field.name] = `${field.label.replace(/\s*\*$/, '')} is required`
      }
      if (field.validate) {
        const msg = field.validate(values[field.name], values)
        if (msg) next[field.name] = msg
      }
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = async (e) => {
    e?.preventDefault?.()
    if (!validateStep()) return
    if (!isLastStep) { setStepIndex((i) => i + 1); return }

    setStatus('submitting'); setErrors({}); setTopError('')
    try {
      /* Click token handed over by the email that sent them here (see PageViewTracker). Passing it
         with the submission is what lets the backend credit this conversion to the campaign that
         produced it, instead of recording an anonymous inbound lead. */
      let sx
      try { sx = localStorage.getItem('sx_click_token') || undefined } catch { /* ignore */ }
      const res = await submitLead(kind, {
        ...extraPayload,
        ...values,
        sx,
        source_url: typeof window !== 'undefined' ? window.location.href : undefined,
      }, { test: isTestModeFromUrl() })
      if (typeof res?.booking_url === 'string' && res.booking_url) {
        setAssignedBookingUrl(res.booking_url)
      }
      if (typeof res?.download_url === 'string' && res.download_url) {
        /* Gated pack flow: start the download at once (the link is signed and
           short-lived) and keep a button on the success screen as the retry. */
        setPackDownloadUrl(res.download_url)
        try { window.location.href = res.download_url } catch { /* button remains */ }
      }
      setStatus('success')
    } catch (err) {
      if (err instanceof ApiError && err.status === 422 && err.body?.errors) {
        setErrors(err.body.errors)
        setTopError(err.body.message || 'Please fix the highlighted fields.')
      } else {
        setTopError(err?.message || 'Something went wrong. Please try again, or email enquiries@soccerex.com.')
      }
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <SuccessState theme={theme} title={successTitle} body={successBody}
        bookingUrl={assignedBookingUrl || bookingUrl} downloadUrl={packDownloadUrl}>
        {children}
      </SuccessState>
    )
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3" noValidate>
      {isMultiStep && <StepIndicator current={stepIndex} total={totalSteps} theme={theme} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {step.fields.map((field) => {
          if (field.requires && !shouldShow(field, values)) return null
          const fieldError = errors[field.name]?.[0] || errors[field.name]
          return (
            <FieldRow key={field.name} field={field} value={values[field.name] || ''} onChange={update(field.name)} error={fieldError} theme={theme} />
          )
        })}
      </div>

      {topError && (
        <p className="font-body" style={{ fontSize: 12.5, color: theme === 'dark' ? '#ff8080' : '#b91c1c' }}>{topError}</p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
        {isMultiStep && stepIndex > 0 ? (
          <button type="button" onClick={() => setStepIndex((i) => i - 1)} className={theme === 'dark' ? 'event-btn-outline' : 'event-btn-outline-light'} style={{ padding: '12px 18px', fontSize: 12 }}>
            <ArrowLeft size={13} /> Back
          </button>
        ) : <span />}
        <button type="submit" disabled={status === 'submitting'} className="event-btn-primary" style={{ padding: '12px 22px', fontSize: 12 }}>
          {status === 'submitting' ? <><Loader2 size={13} className="prog-spin" /> Sending</>
            : isLastStep ? <><Send size={13} /> {submitLabel || 'Send'}</>
            : <>Continue <ArrowRight size={13} /></>}
        </button>
      </div>
    </form>
  )
}

/* shouldShow respects `requires` predicates so we can hide fields until the
   user picks a value that needs them (e.g. "Other organisation type"). */
function shouldShow(field, values) {
  const req = field.requires
  if (!req) return true
  if (typeof req === 'function') return !!req(values)
  return values[req.field] === req.equals
}

function FieldRow({ field, value, onChange, error, theme }) {
  const inputClass = theme === 'dark' ? 'pre-reg-input' : 'prog-input'
  const labelStyle = theme === 'dark'
    ? { fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)' }
    : { fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#607186' }
  const span = field.span === 'full' ? 'col-span-1 sm:col-span-2' : 'col-span-1'

  return (
    <label className={`flex flex-col gap-1.5 ${span}`}>
      <span className="font-mono" style={labelStyle}>{field.label}</span>
      {field.type === 'textarea' ? (
        <textarea required={field.required} rows={field.rows || 3} value={value} onChange={onChange}
          placeholder={field.placeholder} className={inputClass} autoFocus={field.autoFocus}
          aria-invalid={!!error} />
      ) : field.type === 'select' ? (
        <select required={field.required} value={value} onChange={onChange} className={inputClass} aria-invalid={!!error}>
          <option value="">{field.placeholder || 'Select…'}</option>
          {(field.options || []).map((opt) => {
            const v = typeof opt === 'string' ? opt : opt.value
            const l = typeof opt === 'string' ? opt : opt.label
            return <option key={v} value={v}>{l}</option>
          })}
        </select>
      ) : field.type === 'checkbox' ? (
        <span className="inline-flex items-center gap-2" style={{ fontSize: 12.5, color: theme === 'dark' ? 'rgba(255,255,255,0.8)' : '#3a4a5a' }}>
          <input type="checkbox" checked={!!value} onChange={onChange} /> {field.checkboxLabel || field.placeholder}
        </span>
      ) : (
        <input required={field.required} type={field.type || 'text'} value={value} onChange={onChange}
          placeholder={field.placeholder} className={inputClass} autoFocus={field.autoFocus}
          list={field.suggest ? `${field.name}-suggest` : undefined} autoComplete={field.autoComplete}
          aria-invalid={!!error} />
      )}
      {field.suggest && (
        <datalist id={`${field.name}-suggest`}>
          {field.suggest.map((s) => <option key={s} value={s} />)}
        </datalist>
      )}
      {field.hint && !error && (
        <span className="font-body" style={{ fontSize: 11, color: theme === 'dark' ? 'rgba(255,255,255,0.55)' : '#607186' }}>{field.hint}</span>
      )}
      {error && (
        <span className="font-body" style={{ fontSize: 11, color: theme === 'dark' ? '#ff8080' : '#b91c1c' }}>{error}</span>
      )}
    </label>
  )
}

function StepIndicator({ current, total, theme }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} style={{
          flex: '1 1 0', height: 3,
          background: i <= current
            ? 'var(--event-primary, #E91E63)'
            : theme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(13,27,42,0.10)',
        }} />
      ))}
      <span className="font-mono" style={{ fontSize: 10, letterSpacing: '0.16em', color: theme === 'dark' ? 'rgba(255,255,255,0.55)' : '#607186', textTransform: 'uppercase' }}>
        Step {current + 1} of {total}
      </span>
    </div>
  )
}

function SuccessState({ theme, title, body, bookingUrl, downloadUrl, children }) {
  return (
    <div className="flex flex-col items-center text-center" style={{ padding: '24px 8px' }}>
      <div style={{
        width: 52, height: 52, borderRadius: 999,
        background: theme === 'dark' ? 'rgba(16,185,129,0.15)' : 'rgba(16,185,129,0.10)',
        border: '1px solid rgba(16,185,129,0.30)',
        display: 'grid', placeItems: 'center', marginBottom: 14,
      }}>
        <Check size={22} style={{ color: '#10b981' }} />
      </div>
      <h4 className="font-heading font-bold mb-2" style={{ fontSize: '1.1rem', color: theme === 'dark' ? '#fff' : '#0D1B2A' }}>
        {title || "Thanks — we'll be in touch."}
      </h4>
      <p className="font-body leading-relaxed" style={{ fontSize: 13.5, color: theme === 'dark' ? 'rgba(255,255,255,0.65)' : '#3a4a5a', maxWidth: 480 }}>
        {body || "Your message is on its way to the Soccerex team. We'll follow up by email."}
      </p>
      {downloadUrl && (
        <a href={downloadUrl} className="event-btn-primary" style={{ marginTop: 16, padding: '12px 22px', fontSize: 12, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <Download size={13} /> Download the pack (PDF)
        </a>
      )}
      {bookingUrl && (
        <div className="flex flex-col items-center gap-2" style={{ marginTop: 18 }}>
          <BookingLink to={bookingUrl} className="event-btn-primary" style={{ padding: '12px 22px', fontSize: 12, textDecoration: 'none' }}>
            <CalendarClock size={13} /> Book a call now
          </BookingLink>
          <span className="font-body" style={{ fontSize: 12, color: theme === 'dark' ? 'rgba(255,255,255,0.55)' : '#607186', maxWidth: 380 }}>
            No need to wait for the email: grab 15 minutes with the team now. If nothing is open, tell us when you are free and we will come back with times.
          </span>
        </div>
      )}
      {children ? <div style={{ marginTop: 14 }}>{children}</div> : null}
    </div>
  )
}

/* Internal paths go through the router; a backend-provided booking_url may be
   absolute, so fall back to a plain anchor for anything that is not a path. */
function BookingLink({ to, children, ...rest }) {
  return String(to).startsWith('/')
    ? <Link to={to} {...rest}>{children}</Link>
    : <a href={to} {...rest}>{children}</a>
}
