import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Loader2, AlertCircle, ShieldCheck } from 'lucide-react'
import { getArticlePreview, ApiError } from '../lib/soccerexApi'
import { ArticleLayout, normalizeCmsArticleDetail } from './InsightArticle'

/* Signed, expiring preview of an article in ANY status (drafts included), rendered
   with the exact same layout the public /insights/:slug page uses. Links are minted
   from the admin Articles surface only; the signature params are forwarded verbatim
   to the signed API route, which is the sole authority (a missing/expired/tampered
   signature is a 403 and this page just shows the error). Shareable for 7 days,
   not indexed, never linked from anywhere public. */

const STATUS_LABELS = { draft: 'Draft', scheduled: 'Scheduled', published: 'Published', archived: 'Archived' }

const RIBBON_COPY = {
  draft: 'Draft · shown exactly as it will appear once published · not visible to the public',
  scheduled: 'Scheduled · shown exactly as it will appear once published · not yet visible to the public',
  published: 'Published · this article is live on the site · this signed link is just a shareable copy',
  archived: 'Archived · no longer on the public site',
}

export default function ArticlePreview() {
  const { articleId } = useParams()
  const [params] = useSearchParams()
  const [state, setState] = useState({ article: null, status: null, error: null })

  const expires = params.get('expires')
  const signature = params.get('signature')

  /* Keep crawlers out even if a link leaks: signed URLs expire within a week anyway. */
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    return () => { document.head.removeChild(meta) }
  }, [])

  useEffect(() => {
    if (!expires || !signature) {
      setState({ article: null, status: null, error: new Error('This preview link is incomplete.') })
      return
    }
    let cancelled = false
    getArticlePreview(articleId, { expires, signature })
      .then((data) => {
        if (cancelled) return
        const status = data.preview?.status || null
        const normalized = normalizeCmsArticleDetail(data)
        if (!normalized.date) normalized.date = STATUS_LABELS[status] || 'Draft'
        setState({ article: normalized, status, error: null })
      })
      .catch((err) => { if (!cancelled) setState({ article: null, status: null, error: err }) })
    return () => { cancelled = true }
  }, [articleId, expires, signature])

  const { article, status, error } = state

  return (
    <div style={{ background: '#050d1a', minHeight: '100vh', paddingBottom: '84px' }}>
      {error && (
        <section style={{ padding: 'clamp(140px,16vw,190px) clamp(24px,5vw,60px)' }}>
          <div className="flex items-start gap-3" style={{
            maxWidth: 760, margin: '0 auto',
            background: '#FDF0EF', border: '1px solid rgba(160,40,30,0.25)', borderRadius: 12,
            padding: '16px 18px', color: '#8A2C23', fontSize: 14,
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <p style={{ fontWeight: 600, marginBottom: 2 }}>Preview unavailable</p>
              <p>
                {error instanceof ApiError && error.status === 403
                  ? 'This preview link has expired or is invalid. Open a fresh one from the article in the admin.'
                  : (error.message || 'Something went wrong loading the preview.')}
              </p>
            </div>
          </div>
        </section>
      )}
      {!error && !article && (
        <section style={{ padding: 'clamp(140px,16vw,190px) clamp(24px,5vw,60px)' }}>
          <div className="flex items-center gap-2" style={{ maxWidth: 760, margin: '0 auto', color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>
            <Loader2 size={16} className="animate-spin" /> Loading preview
          </div>
        </section>
      )}
      {article && <ArticleLayout article={article} related={[]} />}

      {/* Always-visible ribbon (bottom; z-index below the fixed site nav's 50 so
          menus stay usable) so nobody mistakes a shared draft for a published page. */}
      <div style={{
        position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 40,
        background: '#FFF7E6', borderTop: '1px solid rgba(180,120,10,0.35)',
        padding: '9px clamp(24px,5vw,60px)', boxShadow: '0 -6px 24px rgba(5,13,26,0.25)',
      }}>
        <div className="flex items-center gap-2 flex-wrap" style={{ maxWidth: 860, margin: '0 auto', fontSize: 12.5, color: '#7A4E0B' }}>
          <ShieldCheck size={14} />
          <strong>Article preview</strong>
          <span>{RIBBON_COPY[status] || RIBBON_COPY.draft}</span>
          <span style={{ opacity: 0.7 }}>· link works for 7 days</span>
        </div>
      </div>
    </div>
  )
}
