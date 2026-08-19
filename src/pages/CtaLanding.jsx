import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'
import PageMeta from '../components/PageMeta'
import { CtaButton, CtaForm } from '../components/CtaAction'
import { HOME } from '../lib/routes'
import { getCta } from '../lib/soccerexApi'

const NAVY = '#09203e'

/*
 * The landing page an email button links to: /cta/{slug}. Emails cannot host a
 * popup, so this page IS the popup: the same CTA defined in the admin CTA
 * section, rendered standalone. Form CTAs show the form inline; link CTAs show
 * the pitch and the button.
 */
export default function CtaLanding() {
  const { slug } = useParams()
  const [cta, setCta] = useState(null)
  const [state, setState] = useState('loading') // loading | ready | missing

  useEffect(() => {
    window.scrollTo(0, 0)
    let alive = true
    setState('loading')
    getCta(slug)
      .then((data) => { if (alive) { setCta(data); setState('ready') } })
      .catch(() => { if (alive) setState('missing') })
    return () => { alive = false }
  }, [slug])

  return (
    <div style={{ background: NAVY, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PageMeta title={cta ? `${cta.title} | Soccerex` : 'Soccerex'} description={cta?.body || ''} />

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(90px,12vh,140px) 20px clamp(48px,8vh,80px)' }}>
        <div style={{ width: '100%', maxWidth: 480 }}>
          <p className="font-mono uppercase tracking-[0.18em] text-center mb-3" style={{ fontSize: '0.65rem', color: 'var(--color-brand-accent)', fontWeight: 700 }}>
            Soccerex
          </p>

          {state === 'loading' && (
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)', padding: '60px 0' }}>
              <Loader2 size={26} className="animate-spin" style={{ margin: '0 auto' }} />
            </div>
          )}

          {state === 'missing' && (
            <div style={{ background: '#fff', borderRadius: 14, padding: 'clamp(26px,4vw,36px)', textAlign: 'center', boxShadow: '0 30px 80px rgba(0,0,0,0.45)' }}>
              <h1 className="font-heading font-bold" style={{ color: NAVY, fontSize: '1.3rem', marginBottom: 10 }}>
                This link is no longer active
              </h1>
              <p className="font-body" style={{ color: '#586778', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: 18 }}>
                The offer behind it has ended. Everything current is on the site.
              </p>
              <Link to={HOME} className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.12em]" style={{ color: NAVY, background: 'var(--color-brand-accent)', padding: '12px 22px', fontSize: '0.78rem', borderRadius: 6, textDecoration: 'none' }}>
                <ArrowLeft size={14} /> Soccerex home
              </Link>
            </div>
          )}

          {state === 'ready' && cta && (
            <div style={{ background: '#fff', borderRadius: 14, padding: 'clamp(26px,4vw,36px)', boxShadow: '0 30px 80px rgba(0,0,0,0.45)' }}>
              {cta.kind === 'form' ? (
                <CtaForm cta={cta} />
              ) : (
                <div style={{ textAlign: 'center' }}>
                  {cta.image_url && (
                    <img src={cta.image_url} alt="" style={{ width: '100%', height: 'auto', borderRadius: 10, marginBottom: 18 }} />
                  )}
                  <h1 className="font-heading font-bold" style={{ color: NAVY, fontSize: '1.35rem', lineHeight: 1.25, marginBottom: 10 }}>
                    {cta.title}
                  </h1>
                  {cta.body && (
                    <p className="font-body" style={{ color: '#586778', fontSize: '0.98rem', lineHeight: 1.6, marginBottom: 20 }}>{cta.body}</p>
                  )}
                  <CtaButton cta={cta} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
