import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Loader2, CheckCircle2, Calendar, MapPin, ArrowRight, Lock, X } from 'lucide-react'
import { getCastingContext, submitCastingResponse } from '../lib/soccerexApi'

const NAVY = '#09203e'
const ACCENT = '#e6325e'

/**
 * The prospect's on-system response page (/speak?token=...). A speaker we invited
 * lands here and their tap advances their own candidacy — no email thread. The
 * call to action escalates with the stage (the backend sends the right wording);
 * the journey stays soft early, committal only when it counts.
 */
export default function SpeakerRespond() {
  const [params] = useSearchParams()
  const token = params.get('token') || ''

  const [state, setState] = useState('loading') // loading | invalid | ready | done
  const [ctx, setCtx] = useState(null)
  const [busy, setBusy] = useState(false)
  const [doneMsg, setDoneMsg] = useState('')
  const [showCondition, setShowCondition] = useState(false)
  const [condition, setCondition] = useState('')
  const [showPropose, setShowPropose] = useState(false)
  const [proposed, setProposed] = useState('')

  useEffect(() => {
    let alive = true
    if (!token) { setState('invalid'); return }
    getCastingContext(token)
      .then((d) => {
        if (!alive) return
        setCtx(d)
        // Always let them respond — and update later if they change their mind.
        // Pre-fill any condition they gave before so they don't retype it.
        if (d.condition) { setCondition(d.condition); setShowCondition(true) }
        setState('ready')
      })
      .catch(() => { if (alive) setState('invalid') })
    return () => { alive = false }
  }, [token])

  async function send(action, extra = {}) {
    if (busy) return
    setBusy(true)
    try {
      const res = await submitCastingResponse({ token, action, ...extra })
      setDoneMsg(res?.message || 'Thank you — we have recorded your response.')
    } catch {
      setDoneMsg('Something went wrong. Please try again, or reply to the message you received.')
    } finally {
      setBusy(false)
      setState('done')
    }
  }

  const wrap = {
    minHeight: '100vh', background: `linear-gradient(160deg, ${NAVY} 0%, #050d1a 100%)`,
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
  }
  const card = {
    width: '100%', maxWidth: 480, background: '#fff', borderRadius: 16,
    padding: '28px 26px', boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
  }

  return (
    <div style={wrap}>
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <span style={{ fontSize: 12, letterSpacing: '0.06em', fontWeight: 700, color: NAVY }}>{(ctx?.event?.name || 'Soccerex').toUpperCase()}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#9aa6b3' }}>
            <Lock size={12} /> on soccerex.com
          </span>
        </div>

        {state === 'loading' && (
          <div style={{ textAlign: 'center', padding: '30px 0', color: '#7a8694' }}>
            <Loader2 size={26} className="animate-spin" />
          </div>
        )}

        {state === 'invalid' && (
          <div style={{ textAlign: 'center', padding: '14px 0' }}>
            <p style={{ fontSize: 17, fontWeight: 600, color: NAVY, margin: '0 0 6px' }}>This link isn&rsquo;t valid</p>
            <p style={{ fontSize: 14, color: '#7a8694', margin: 0 }}>It may have expired. Please reply to the Soccerex message you received and we&rsquo;ll send a fresh one.</p>
          </div>
        )}

        {state === 'done' && (
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <CheckCircle2 size={40} color="#16a34a" style={{ margin: '0 auto 10px' }} />
            <p style={{ fontSize: 17, fontWeight: 600, color: NAVY, margin: '0 0 6px' }}>{doneMsg}</p>
            <p style={{ fontSize: 12.5, color: '#9aa6b3', margin: '14px 0 0', lineHeight: 1.6 }}>
              You can complete your full Soccerex profile anytime &mdash; it also powers Deal Network and your event tools.{' '}
              <a href="/profile-access" style={{ color: NAVY, fontWeight: 600 }}>Set it up</a> <span style={{ color: '#b9c0c8' }}>(optional)</span>
            </p>
          </div>
        )}

        {state === 'ready' && ctx && (
          <>
            {(ctx.is_closed || ctx.already_responded) && (
              <div style={{ fontSize: 12.5, color: '#7a8694', background: '#f4f3f0', borderRadius: 8, padding: '8px 11px', marginBottom: 14, lineHeight: 1.5 }}>
                {ctx.is_closed
                  ? 'You let us know this wasn’t right before — changed your mind? You can update your answer below.'
                  : 'You’ve already responded — you can change or add to it anytime below.'}
              </div>
            )}
            <p style={{ fontSize: 14, color: '#7a8694', margin: '0 0 4px' }}>
              {ctx.name ? `${ctx.name}, ` : ''}your name has been put forward {ctx.is_media ? 'for our broadcast' : 'for the programme'}{ctx.topic ? ':' : ` at ${ctx.event?.name || 'Soccerex'}.`}
            </p>
            {ctx.topic && (
              <p style={{ fontSize: 19, fontWeight: 600, color: NAVY, margin: '0 0 8px', lineHeight: 1.25 }}>{ctx.topic.title}</p>
            )}
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: 12.5, color: '#9aa6b3', margin: '0 0 12px' }}>
              {ctx.event?.starts_on && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Calendar size={13} /> {ctx.event.starts_on}</span>}
              {ctx.event?.city && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><MapPin size={13} /> {ctx.event.city}</span>}
            </div>
            <p style={{ fontSize: 13, color: '#7a8694', margin: '0 0 18px', lineHeight: 1.55 }}>
              {ctx.is_media
                ? 'Our studio line-up is kept deliberately small. If you would be open to taking part, let us know below and we will be in touch.'
                : 'Each session is kept to a small, carefully chosen group. If you would be open to taking part, let us know below and we will be in touch.'}
            </p>

            <button onClick={() => send('interested', condition ? { condition } : {})} disabled={busy}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: ACCENT, color: '#fff', border: 'none', borderRadius: 10, padding: '13px 16px', fontSize: 15, fontWeight: 600, cursor: busy ? 'wait' : 'pointer', marginBottom: 10 }}>
              {busy ? <Loader2 size={16} className="animate-spin" /> : null} {ctx.cta} <ArrowRight size={16} />
            </button>

            {!showCondition ? (
              <button onClick={() => setShowCondition(true)} style={linkBtn}>Add a condition (dates, travel)</button>
            ) : (
              <textarea value={condition} onChange={(e) => setCondition(e.target.value)} placeholder="e.g. Any day except Friday; happy to join if travel is covered"
                rows={2} style={ta} />
            )}

            <div style={{ height: 1, background: '#eef0f2', margin: '16px 0' }} />

            {!showPropose ? (
              <button onClick={() => setShowPropose(true)} style={secBtn}>I&rsquo;d rather talk about something else</button>
            ) : (
              <div>
                <textarea value={proposed} onChange={(e) => setProposed(e.target.value)} placeholder="What would you love to discuss on stage?" rows={2} style={ta} />
                <button onClick={() => send('propose', { proposed_topic: proposed })} disabled={busy || !proposed.trim()} style={{ ...secBtn, background: NAVY, color: '#fff', borderColor: NAVY, marginTop: 8, opacity: (!proposed.trim() ? 0.5 : 1) }}>
                  Send my suggestion
                </button>
              </div>
            )}

            <button onClick={() => send('decline')} disabled={busy} style={{ ...linkBtn, color: '#9aa6b3', marginTop: 12 }}>
              <X size={13} style={{ verticalAlign: -2 }} /> Not this time
            </button>
          </>
        )}
      </div>
    </div>
  )
}

const linkBtn = { background: 'none', border: 'none', color: NAVY, fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: '4px 0', textAlign: 'left', width: '100%' }
const secBtn = { width: '100%', background: '#fff', border: '1px solid #d7dbe0', color: NAVY, borderRadius: 10, padding: '11px 14px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }
const ta = { width: '100%', boxSizing: 'border-box', border: '1px solid #d7dbe0', borderRadius: 8, padding: '9px 11px', fontSize: 13.5, fontFamily: 'inherit', resize: 'vertical', marginTop: 8 }
