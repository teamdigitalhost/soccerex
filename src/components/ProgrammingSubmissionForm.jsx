import { useEffect, useState } from 'react'
import { X, Check, Loader2, AlertCircle } from 'lucide-react'
import { submitProgrammingProposal, ApiError } from '../lib/soccerexApi'
import { isTestModeFromUrl } from '../lib/testMode'

const KIND_OPTIONS = [
  { value: 'speaker_interest', label: 'Suggest a speaker', help: 'Yourself or someone you would like to see on this topic.' },
  { value: 'topic_suggestion', label: 'Suggest a topic',   help: 'A new program theme worth exploring at this event.' },
  { value: 'session_proposal', label: 'Propose a session', help: 'A specific session, panel, or fireside you want to lead.' },
]

const initialForm = {
  kind: 'speaker_interest',
  topic_slug: '',
  name: '',
  email: '',
  company: '',
  role: '',
  proposal: '',
  bio: '',
}

/**
 * Modal-style programming submission form.
 *
 * Props:
 *   open        boolean
 *   onClose     () => void
 *   eventSlug   string
 *   topic       optional { slug, title } — when provided, prefills topic_slug
 *               and locks kind to speaker_interest by default
 *   defaultKind optional override for the kind selector
 */
export default function ProgrammingSubmissionForm({ open, onClose, eventSlug, topic, defaultKind }) {
  const [form, setForm] = useState(() => ({
    ...initialForm,
    topic_slug: topic?.slug || '',
    kind: defaultKind || (topic ? 'speaker_interest' : initialForm.kind),
  }))
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('')

  /* Reset state when topic prop changes or modal reopens */
  useEffect(() => {
    if (!open) return
    setForm({
      ...initialForm,
      topic_slug: topic?.slug || '',
      kind: defaultKind || (topic ? 'speaker_interest' : initialForm.kind),
    })
    setStatus('idle')
    setErrorMsg('')
  }, [open, topic, defaultKind])

  /* Close on Escape */
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')
    try {
      const payload = { ...form }
      if (!payload.topic_slug) delete payload.topic_slug
      Object.keys(payload).forEach((k) => { if (payload[k] === '') delete payload[k] })
      await submitProgrammingProposal(eventSlug, payload, { test: isTestModeFromUrl() })
      setStatus('success')
    } catch (err) {
      setStatus('error')
      if (err instanceof ApiError) {
        const detail = err.body && err.body.errors
          ? Object.values(err.body.errors).flat().join(' ')
          : err.message
        setErrorMsg(detail)
      } else {
        setErrorMsg('Something went wrong. Please try again or email enquiries@soccerex.com.')
      }
    }
  }

  const stop = (e) => e.stopPropagation()

  return (
    <div role="dialog" aria-modal="true" aria-label="Submit programming proposal"
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(13,27,42,0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(12px, 4vw, 32px)',
        overflowY: 'auto',
      }}
    >
      <div onClick={stop} style={{
        background: '#FFFFFF',
        width: '100%', maxWidth: '560px',
        borderRadius: '16px',
        boxShadow: '0 30px 80px -20px rgba(13,27,42,0.55)',
        overflow: 'hidden',
        position: 'relative',
      }}>
        <button type="button" onClick={onClose} aria-label="Close"
          style={{
            position: 'absolute', top: 14, right: 14, zIndex: 2,
            width: 36, height: 36, borderRadius: 999,
            background: 'rgba(13,27,42,0.06)', border: 'none',
            display: 'grid', placeItems: 'center', cursor: 'pointer',
          }}>
          <X size={18} style={{ color: '#0D1B2A' }} />
        </button>

        {/* Pink top stripe */}
        <div style={{ height: 4, background: 'var(--event-sunset, linear-gradient(90deg, #007C91 0%, #E91E63 50%, #FFB46A 100%))' }} />

        <div style={{ padding: 'clamp(24px, 4vw, 36px)' }}>
          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '12px 0 8px' }}>
              <div style={{ width: 64, height: 64, borderRadius: 999, background: 'rgba(0,124,145,0.10)', border: '1px solid rgba(0,124,145,0.3)', display: 'grid', placeItems: 'center', margin: '0 auto 18px' }}>
                <Check size={28} style={{ color: 'var(--event-secondary, #007C91)' }} />
              </div>
              <h3 className="font-heading font-bold" style={{ fontSize: '1.4rem', color: '#0D1B2A', marginBottom: 10 }}>Submission received.</h3>
              <p className="font-body" style={{ fontSize: '0.95rem', color: '#3a4a5a', maxWidth: '420px', margin: '0 auto 24px' }}>
                Thanks{form.name ? `, ${form.name.split(' ')[0]}` : ''}. The Soccerex program team will review and reach out if there is a fit.
              </p>
              <button type="button" onClick={onClose} className="event-btn-outline-light">Close</button>
            </div>
          ) : (
            <>
              <p className="font-mono" style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--event-primary, #E91E63)', marginBottom: 8 }}>
                {topic ? `Topic: ${topic.title}` : 'Programming submission'}
              </p>
              <h3 className="font-heading font-bold" style={{ fontSize: '1.4rem', color: '#0D1B2A', marginBottom: 6 }}>
                Get involved with the program
              </h3>
              <p className="font-body" style={{ fontSize: '0.92rem', color: '#3a4a5a', marginBottom: 22 }}>
                Suggest yourself, a speaker, or a topic. We review every submission.
              </p>

              <form onSubmit={submit} className="flex flex-col gap-3">
                <Field label="Submission type">
                  <select value={form.kind} onChange={update('kind')} className="prog-input">
                    {KIND_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <p className="font-body" style={{ fontSize: 11, color: '#607186', marginTop: 4 }}>
                    {KIND_OPTIONS.find((o) => o.value === form.kind)?.help}
                  </p>
                </Field>

                {topic && (
                  <p className="font-body" style={{ fontSize: 12, color: '#607186', marginTop: -4 }}>
                    Topic <code style={{ background: 'rgba(13,27,42,0.06)', padding: '1px 6px', borderRadius: 4 }}>{topic.slug}</code> will be sent with this submission.
                  </p>
                )}

                <Field label="Full name *">
                  <input required value={form.name} onChange={update('name')} placeholder="Ada Speaker" className="prog-input" />
                </Field>
                <Field label="Email *">
                  <input required type="email" value={form.email} onChange={update('email')} placeholder="ada@example.com" className="prog-input" />
                </Field>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Company">
                    <input value={form.company} onChange={update('company')} placeholder="Future Stadium Group" className="prog-input" />
                  </Field>
                  <Field label="Role">
                    <input value={form.role} onChange={update('role')} placeholder="Chief Experience Officer" className="prog-input" />
                  </Field>
                </div>
                <Field label="Proposal">
                  <textarea value={form.proposal} onChange={update('proposal')} placeholder="Brief description of the talk, panel, or perspective." rows={3} className="prog-input" />
                </Field>
                <Field label="Short bio">
                  <textarea value={form.bio} onChange={update('bio')} placeholder="2-3 sentences about the speaker." rows={2} className="prog-input" />
                </Field>

                {status === 'error' && (
                  <div className="flex items-start gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.25)', color: '#7c1d1d' }}>
                    <AlertCircle size={16} style={{ marginTop: 2, flexShrink: 0 }} />
                    <p className="font-body" style={{ fontSize: '0.85rem' }}>{errorMsg}</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-3 mt-2">
                  <button type="submit" disabled={status === 'submitting'} className="miami-pill-primary" style={{ flex: '1 1 auto', justifyContent: 'center' }}>
                    {status === 'submitting' ? (
                      <><Loader2 size={15} className="prog-spin" /> Sending</>
                    ) : 'Submit'}
                  </button>
                  <button type="button" onClick={onClose} className="event-btn-outline-light" style={{ flex: '0 0 auto' }}>Cancel</button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono" style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#607186' }}>{label}</span>
      {children}
    </label>
  )
}
