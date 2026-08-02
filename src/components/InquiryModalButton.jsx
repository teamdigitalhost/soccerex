import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import LeadForm from './LeadForm'

/**
 * InquiryModalButton — pairs a CTA button with a modal-form. Drop into any
 * section that needs to expose a public lead-intake without taking over the
 * surrounding layout.
 *
 * Props:
 *   label:       button text (also doubles as the modal heading by default)
 *   kind:        LeadForm kind (passed through)
 *   schema:      LeadForm schema (passed through)
 *   extraPayload, submitLabel, successTitle, successBody, bookingUrl, theme:
 *                passed to LeadForm (bookingUrl powers the success-state
 *                "Book a call now" CTA; see LeadForm)
 *   buttonClassName, buttonStyle: caller controls the trigger look so the
 *                                 button inherits the host section's styling.
 *   eyebrow:     small uppercase label above the modal heading
 *   intro:       single short paragraph below the heading (optional)
 *   modalTitle:  override the modal heading (defaults to `label`)
 *   children:    if provided, used as the button content instead of `label`
 *                (useful for embedding icons or custom layouts)
 */
export default function InquiryModalButton({
  label,
  kind,
  schema,
  extraPayload,
  submitLabel,
  successTitle,
  successBody,
  bookingUrl,
  theme = 'light',
  buttonClassName,
  buttonStyle,
  eyebrow,
  intro,
  modalTitle,
  children,
}) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const esc = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', esc)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', esc)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={buttonClassName} style={buttonStyle}>
        {children || label}
      </button>
      {open && (
        <div role="dialog" aria-modal="true" onClick={() => setOpen(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(13,27,42,0.55)', zIndex: 80,
          display: 'grid', placeItems: 'center', padding: 16,
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            background: '#FFFFFF', border: '1px solid rgba(13,27,42,0.10)',
            width: 'min(620px, 100%)', maxHeight: '92vh', overflow: 'auto',
          }}>
            <div className="flex items-start justify-between gap-3" style={{ padding: '20px 26px', borderBottom: '1px solid rgba(13,27,42,0.08)' }}>
              <div>
                {eyebrow && <p className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.22em', color: '#607186', marginBottom: 4 }}>{eyebrow}</p>}
                <p className="font-heading font-bold" style={{ fontSize: 17, color: '#0D1B2A' }}>{modalTitle || label}</p>
                {intro && <p className="font-body mt-2" style={{ fontSize: 13, color: '#3a4a5a' }}>{intro}</p>}
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#607186' }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: 26 }}>
              <LeadForm
                kind={kind}
                schema={schema}
                extraPayload={extraPayload}
                submitLabel={submitLabel}
                successTitle={successTitle}
                successBody={successBody}
                bookingUrl={bookingUrl}
                theme={theme}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
