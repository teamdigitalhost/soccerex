import { useState } from 'react'
import { ArrowRight, X, Download, Loader2, CheckCircle2 } from 'lucide-react'
import { submitCta } from '../lib/soccerexApi'
import { readCampaignAttribution } from '../lib/campaignAttribution'

/*
 * One CTA, everywhere it appears. A CTA object comes from the CTA section
 * (kind 'link' or 'form', field config, optional gated download) via the
 * article payload or GET /ctas/{slug}:
 *   <CtaButton cta={cta} label="Optional override" />  in an article body
 *   <CtaForm cta={cta} />                              inline on /cta/{slug}
 * Link CTAs navigate; form CTAs open the popup; submissions land in Leads and,
 * when the CTA gates an asset, earn a short-lived signed download link.
 */

const NAVY = '#09203e'

export function CtaButton({ cta, label }) {
  const [open, setOpen] = useState(false)
  if (!cta) return null
  const text = (label || cta.cta_label || 'Learn more').trim()

  if (cta.kind !== 'form') {
    const url = String(cta.cta_url || '')
    if (!url) return null
    const external = /^https?:\/\//i.test(url) && !url.includes('soccerex.com')
    return (
      <a
        href={url}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.12em]"
        style={{ background: 'var(--color-brand-accent)', color: NAVY, padding: '14px 26px', fontSize: '0.82rem', borderRadius: 6, textDecoration: 'none' }}
      >
        {text} <ArrowRight size={15} />
      </a>
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.12em]"
        style={{ background: 'var(--color-brand-accent)', color: NAVY, padding: '14px 26px', fontSize: '0.82rem', border: 'none', borderRadius: 6, cursor: 'pointer' }}
      >
        {text} <ArrowRight size={15} />
      </button>
      {open && <CtaModal cta={cta} onClose={() => setOpen(false)} />}
    </>
  )
}

function CtaModal({ cta, onClose }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={cta.form_headline || cta.title}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(9,32,62,0.66)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
    >
      <div style={{ background: '#fff', borderRadius: 14, maxWidth: 460, width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: 'clamp(24px,4vw,34px)', boxShadow: '0 30px 80px rgba(0,0,0,0.45)', position: 'relative' }}>
        <button type="button" onClick={onClose} aria-label="Close" style={{ position: 'absolute', top: 14, right: 14, background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
          <X size={18} />
        </button>
        <CtaForm cta={cta} />
      </div>
    </div>
  )
}

export function CtaForm({ cta }) {
  const [values, setValues] = useState({ name: '', email: '', company: '', phone: '', message: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(null)

  const fields = cta.form_fields || {}
  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const { sx } = readCampaignAttribution() || {}
      const payload = {
        name: values.name,
        email: values.email,
        source_url: typeof window === 'undefined' ? '' : window.location.href,
        ...(sx ? { sx } : {}),
      }
      for (const k of ['company', 'phone', 'message']) {
        if (fields[k] !== 'off' && values[k]) payload[k] = values[k]
      }
      const res = await submitCta(cta.slug, payload)
      setDone(res)
    } catch (err) {
      setError(err?.message || 'Could not send your details. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  if (done) {
    return (
      <div style={{ textAlign: 'center', padding: '8px 0' }}>
        <CheckCircle2 size={34} style={{ color: '#16a34a', margin: '0 auto 12px' }} />
        <p className="font-body" style={{ color: NAVY, fontSize: '1.02rem', lineHeight: 1.6, marginBottom: done.asset_url ? 18 : 0 }}>
          {done.message}
        </p>
        {done.asset_url && (
          <a
            href={done.asset_url}
            className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.12em]"
            style={{ background: 'var(--color-brand-accent)', color: NAVY, padding: '13px 24px', fontSize: '0.8rem', borderRadius: 6, textDecoration: 'none' }}
          >
            <Download size={15} /> Download
          </a>
        )}
      </div>
    )
  }

  const input = (k, label, type = 'text', required = false) => (
    <div style={{ marginBottom: 14 }}>
      <label className="block font-mono uppercase tracking-[0.1em]" style={{ fontSize: '0.66rem', color: NAVY, fontWeight: 600, marginBottom: 6 }}>
        {label}{required ? '' : ' (optional)'}
      </label>
      {k === 'message' ? (
        <textarea
          value={values[k]} onChange={set(k)} required={required} rows={3} disabled={busy}
          style={{ width: '100%', padding: '12px 14px', fontSize: '0.95rem', background: '#f8f7f4', border: '1px solid rgba(9,32,62,0.12)', borderRadius: 8, color: NAVY, outline: 'none', resize: 'vertical' }}
        />
      ) : (
        <input
          type={type} value={values[k]} onChange={set(k)} required={required} disabled={busy}
          style={{ width: '100%', padding: '12px 14px', fontSize: '0.95rem', background: '#f8f7f4', border: '1px solid rgba(9,32,62,0.12)', borderRadius: 8, color: NAVY, outline: 'none' }}
        />
      )}
    </div>
  )

  return (
    <form noValidate={false} onSubmit={handleSubmit}>
      <h3 className="font-heading font-bold" style={{ color: NAVY, fontSize: '1.25rem', lineHeight: 1.25, marginBottom: 8, paddingRight: 20 }}>
        {cta.form_headline || cta.title}
      </h3>
      {cta.form_body && (
        <p className="font-body" style={{ color: '#586778', fontSize: '0.95rem', lineHeight: 1.55, marginBottom: 18 }}>{cta.form_body}</p>
      )}
      {!cta.form_body && <div style={{ height: 10 }} />}

      {input('name', 'Name', 'text', true)}
      {input('email', 'Work email', 'email', true)}
      {fields.company !== 'off' && input('company', 'Company', 'text', fields.company === 'required')}
      {fields.phone !== 'off' && input('phone', 'Phone', 'tel', fields.phone === 'required')}
      {fields.message !== 'off' && input('message', 'Message', 'text', fields.message === 'required')}

      {error && (
        <p className="font-body" style={{ color: '#b91c1c', fontSize: '0.85rem', marginBottom: 12 }}>{error}</p>
      )}

      <button
        type="submit" disabled={busy}
        className="w-full inline-flex items-center justify-center gap-2 font-body font-semibold uppercase tracking-[0.13em]"
        style={{ background: 'var(--color-brand-accent)', color: NAVY, padding: '14px 24px', fontSize: '0.82rem', border: 'none', borderRadius: 6, cursor: busy ? 'wait' : 'pointer' }}
      >
        {busy ? <><Loader2 size={16} className="animate-spin" /> Sending</> : <>{cta.has_asset ? 'Get the download' : 'Send'} <ArrowRight size={15} /></>}
      </button>
    </form>
  )
}
