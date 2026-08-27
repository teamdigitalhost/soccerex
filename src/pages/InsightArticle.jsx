import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Calendar, Lock, Tag } from 'lucide-react'
import NetworkNodes from '../animations/NetworkNodes'
import PixelDivider from '../components/PixelDivider'
import { INSIGHTS, insightArticle } from '../lib/routes'
import PageMeta from '../components/PageMeta'
import { CtaButton } from '../components/CtaAction'
import { getArticle, unlockArticle } from '../lib/soccerexApi'
import { isTestModeFromUrl } from '../lib/testMode'

/* Where an unlocked article's token lives. Session, not local: closing the tab
   forgets it, which is the right lifetime for a shared word given out for early
   access. */
const gateKey = (slug) => `sx-article-gate:${slug}`

function readGate(slug) {
  try { return window.sessionStorage.getItem(gateKey(slug)) || '' } catch { return '' }
}

function writeGate(slug, token) {
  try { window.sessionStorage.setItem(gateKey(slug), token) } catch { /* private mode: ask again */ }
}

export default function InsightArticle() {
  const { slug } = useParams()
  const [article, setArticle] = useState(null)
  const [allArticles, setAllArticles] = useState([])
  const [locked, setLocked] = useState(null)

  useEffect(() => { window.scrollTo(0, 0) }, [slug])

  useEffect(() => {
    let cancelled = false
    const test = isTestModeFromUrl()

    setArticle(null)
    setAllArticles([])
    setLocked(null)

    fetch('/insights-manifest.json')
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return
        setAllArticles(data)
        const found = data.find((a) => a.slug === slug)
        // Never let the legacy static copy stand in for a page the CMS is
        // holding back: that would render the body the gate exists to withhold.
        setArticle((current) => (current === null ? found || null : current))
      })

    getArticle(slug, { test, gate: readGate(slug) })
      .then((data) => {
        if (cancelled || !data) return
        if (data.locked) {
          setArticle(null)
          setLocked({ slug: data.slug })
          return
        }
        const cmsArticle = normalizeCmsArticleDetail(data)
        setArticle(cmsArticle)
        setAllArticles((current) => {
          if (current.some((a) => a.slug === cmsArticle.slug)) return current
          return [cmsArticle, ...current]
        })
      })
      .catch(() => { /* Static manifest remains the fallback for legacy articles. */ })

    return () => { cancelled = true }
  }, [slug])

  if (locked) {
    return (
      <ArticleLock
        slug={locked.slug}
        onUnlocked={(data, token) => {
          writeGate(locked.slug, token)
          setLocked(null)
          setArticle(normalizeCmsArticleDetail(data))
        }}
      />
    )
  }

  if (!article) {
    return <div style={{ minHeight: '100vh', background: '#050d1a' }} />
  }

  // Related articles: same category, not self, max 3
  const related = allArticles
    .filter((a) => a.slug !== slug && a.categories.some((c) => article.categories.includes(c)))
    .slice(0, 3)

  return <ArticleLayout article={article} related={related} />
}

/* The page someone sees when an article is published but held behind a shared
   password for early access. It shows the headline, so a recipient knows the
   link worked and they are in the right place, and nothing else. */
function ArticleLock({ slug, onUnlocked }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    if (busy || !password.trim()) return
    setBusy(true)
    setError('')
    try {
      const res = await unlockArticle(slug, password)
      onUnlocked(res.data, res.gate)
    } catch (err) {
      setError(err && err.status === 429
        ? 'Too many tries. Wait a minute and try again.'
        : 'That is not the password.')
      setBusy(false)
    }
  }

  return (
    <div style={{ background: '#050d1a', minHeight: '100vh' }}>
      <PageMeta
        title="Soccerex"
        description="This page is available to invited readers."
        path={insightArticle(slug)}
        noindex
      />
      <section className="relative overflow-hidden" style={{ minHeight: '100vh' }}>
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at top, #0d2b52 0%, #050d1a 70%)',
        }} />
        <NetworkNodes color="#ffffff" accentColor="var(--color-brand-accent)" nodeCount={25} opacity={0.12} />

        <div className="relative z-10 flex flex-col items-center justify-center"
          style={{ minHeight: '100vh', padding: 'clamp(88px,10vw,128px) clamp(24px,5vw,80px)' }}>
          <div style={{ maxWidth: '560px', width: '100%', textAlign: 'center' }}>
            {/* No headline here. On a piece held back before its announcement the
                headline IS the announcement, so the page asks for the password and
                says nothing else. */}
            <p className="font-body mb-6 flex items-center justify-center gap-2"
               style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
              <Lock size={14} /> Enter password to continue.
            </p>

            {/* Enter is what people actually press on a one-field form. Implicit
                submission covers it already; the input's onKeyDown makes it certain. */}
            <form onSubmit={submit} className="flex flex-col items-center gap-3">
              <input
                type="password"
                value={password}
                autoFocus
                autoComplete="off"
                aria-label="Password"
                placeholder="Password"
                onChange={(e) => { setPassword(e.target.value); setError('') }}
                onKeyDown={(e) => { if (e.key === 'Enter') submit(e) }}
                style={{
                  width: '100%', maxWidth: '340px', padding: '14px 18px',
                  background: 'rgba(255,255,255,0.06)', color: '#ffffff',
                  border: `1px solid ${error ? 'rgba(248,113,113,0.7)' : 'rgba(255,255,255,0.18)'}`,
                  borderRadius: '8px', fontSize: '1rem', outline: 'none',
                  textAlign: 'center', letterSpacing: '0.08em',
                }}
              />
              <button
                type="submit"
                disabled={busy || !password.trim()}
                className="font-mono uppercase tracking-[0.15em]"
                style={{
                  width: '100%', maxWidth: '340px', padding: '14px 18px',
                  background: busy || !password.trim() ? 'rgba(255,255,255,0.14)' : 'var(--color-brand-accent)',
                  color: busy || !password.trim() ? 'rgba(255,255,255,0.5)' : '#050d1a',
                  border: 'none', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700,
                  cursor: busy || !password.trim() ? 'default' : 'pointer', transition: 'background 0.2s',
                }}
              >
                {busy ? 'Checking' : 'Read it'}
              </button>
              <p aria-live="polite" style={{
                minHeight: '1.2rem', fontSize: '0.85rem',
                color: error ? '#fca5a5' : 'transparent',
              }}>
                {error || '.'}
              </p>
            </form>

            <Link to={INSIGHTS} className="inline-flex items-center gap-2 mt-4 font-mono uppercase tracking-[0.15em]"
              style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>
              <ArrowLeft size={13} /> Back to Insights
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

/* The full article page, shared with the admin draft preview (ArticlePreview),
   which supplies its own article and an empty related list — so a draft renders
   EXACTLY as it will look once published. */
export function ArticleLayout({ article, related = [] }) {
  const articleDesc = article.excerpt
    ? article.excerpt.replace(/<[^>]+>/g, '').slice(0, 200)
    : 'Read the latest insights from Soccerex on the business of football.'

  return (
    <div style={{ background: '#050d1a' }}>
      <PageMeta
        title={`${article.title} | Soccerex Insights`}
        description={articleDesc}
        image={article.featuredImage || undefined}
        path={insightArticle(article.slug)}
        type="article"
      />

      {/* ═══ HERO ═══════════════════════════════════════════════════════════
          A compact title band, not a viewport-filling image. Height comes from
          the content plus padding, so the first paragraph of the article lands
          above the fold instead of a wall of background photo. */}
      <section className="relative overflow-hidden">
        {article.featuredImage && (
          <>
            <div className="absolute inset-0" style={{
              backgroundImage: `url(${article.featuredImage})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
              filter: 'saturate(0.5) brightness(0.3)',
            }} />
            <div className="absolute inset-0" style={{
              background: 'linear-gradient(180deg, rgba(5,13,26,0.5) 0%, rgba(9,32,62,0.7) 40%, rgba(5,13,26,0.95) 100%)',
            }} />
          </>
        )}
        {!article.featuredImage && (
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(ellipse at top, #0d2b52 0%, #050d1a 70%)',
          }} />
        )}
        <NetworkNodes color="#ffffff" accentColor="var(--color-brand-accent)" nodeCount={25} opacity={0.12} />

        <div className="relative z-10 flex flex-col items-center" style={{ padding: 'clamp(104px,10vw,128px) clamp(24px,5vw,80px) clamp(34px,4vw,48px)' }}>
          <div style={{ maxWidth: '860px', textAlign: 'center' }}>
            <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
              {article.categories.filter((c) => c !== 'Uncategorized').map((cat) => (
                <span key={cat} className="font-mono uppercase tracking-[0.15em]" style={{
                  fontSize: '0.65rem', color: 'var(--color-brand-accent)', fontWeight: 600,
                  background: '#ffffff', padding: '5px 14px', borderRadius: '6px',
                  border: '1px solid rgba(9,32,62,0.10)', boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
                }}>
                  {cat}
                </span>
              ))}
              <span className="font-mono flex items-center gap-1.5" style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.5)' }}>
                <Calendar size={12} /> {article.date}
              </span>
            </div>
            <h1 className="font-heading font-bold text-white leading-tight text-glow" style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3.2rem)' }}>
              {article.title}
            </h1>
          </div>
        </div>
      </section>

      <PixelDivider color="#f4f3f0" layers={4} height={56} speed={0.5} />

      {/* ═══ ARTICLE BODY ═══════════════════════════════════════════════════ */}
      <section style={{ background: 'linear-gradient(180deg, #f4f3f0 0%, #eae8e4 100%)', padding: 'clamp(30px,4vw,44px) clamp(24px,5vw,80px) clamp(100px,12vw,160px)' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          {/* Back link */}
          <Link to={INSIGHTS} className="inline-flex items-center gap-2 mb-6 font-mono uppercase tracking-[0.15em]"
            style={{ fontSize: '0.72rem', color: '#09203e', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-brand-accent)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#09203e' }}
          >
            <ArrowLeft size={14} /> Back to Insights
          </Link>

          {/* Excerpt as lede */}
          {article.excerpt && (
            <p className="font-body leading-relaxed mb-8" style={{ fontSize: '1.2rem', color: '#09203e', fontWeight: 500, borderLeft: '4px solid var(--color-brand-accent)', paddingLeft: '20px' }}>
              {article.excerpt}
            </p>
          )}

          {/* Body: rich blocks (headings, lists, quotes) for CMS articles;
              plain paragraphs for the legacy static manifest. */}
          {article.blocks && article.blocks.length
            ? article.blocks.map((b, i) => renderBlock(b, i, article.ctas))
            : article.paragraphs.map((p, i) => (
                <p key={i} className="font-body leading-[1.8] mb-5" style={{ fontSize: '1.05rem', color: '#333' }}>
                  {p}
                </p>
              ))}

          {/* Inline images if any */}
          {article.inlineImages && article.inlineImages.length > 0 && (
            <div className="my-10">
              {article.inlineImages.map((img, i) => (
                <img key={i} src={img} alt="" loading="lazy" style={{
                  width: '100%', borderRadius: '12px', marginBottom: '16px',
                  boxShadow: '0 10px 40px rgba(9,32,62,0.12)',
                }} />
              ))}
            </div>
          )}

          {/* Rotating call-to-action */}
          {article.cta && <PromoBand cta={article.cta} />}
        </div>
      </section>

      {/* ═══ RELATED ARTICLES ═══════════════════════════════════════════════ */}
      {related.length > 0 && (
        <>
          <PixelDivider color="#09203e" layers={4} height={90} speed={0.5} />
          <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #09203e 0%, #050d1a 100%)', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
            <NetworkNodes color="#ffffff" accentColor="var(--color-brand-accent)" nodeCount={20} opacity={0.1} />
            <div className="relative z-10" style={{ maxWidth: '1300px', margin: '0 auto' }}>
              <div className="text-center mb-12">
                <p className="section-label text-brand-accent mb-4">KEEP READING</p>
                <h2 className="font-heading font-bold text-white leading-tight" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)' }}>
                  Related{' '}
                  <span style={{ color: 'var(--color-brand-accent)' }}>Articles</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map((r) => (
                  <Link key={r.id} to={insightArticle(r.slug)} className="block group" style={{ textDecoration: 'none' }}>
                    <div style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(191,177,112,0.15)',
                      borderRadius: '14px',
                      overflow: 'hidden',
                      transition: 'transform 0.3s, border-color 0.3s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.borderColor = 'rgba(191,177,112,0.5)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(191,177,112,0.15)' }}
                    >
                      {r.featuredImage && (
                        <div style={{ aspectRatio: '16/10', overflow: 'hidden' }}>
                          <img src={r.featuredImage} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.8)' }} />
                        </div>
                      )}
                      <div style={{ padding: '20px' }}>
                        <p className="font-mono" style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.45)', marginBottom: '8px' }}>{r.date}</p>
                        <h3 className="font-heading font-bold text-white leading-snug mb-3" style={{ fontSize: '1rem' }}>{r.title}</h3>
                        <span className="inline-flex items-center gap-1 font-body font-semibold uppercase tracking-[0.1em]" style={{ fontSize: '0.72rem', color: 'var(--color-brand-accent)' }}>
                          Read <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  )
}

export function normalizeCmsArticleDetail(a) {
  const slug = a.slug || ''
  const title = a.title || 'Untitled'
  const categories = uniqueLabels([
    a.category,
    a.editorial_label?.name,
    a.event?.name,
    ...(Array.isArray(a.categories) ? a.categories : []),
  ])
  return {
    id: `cms-${a.id || slug}`,
    slug,
    title,
    excerpt: a.excerpt || '',
    categories: categories.length ? categories : ['Insight'],
    date: formatCmsDate(a.published_at),
    featuredImage: a.hero_image_url || a.og_image_url || '',
    paragraphs: bodyToParagraphs(a.body),
    blocks: parseBlocks(a.body),
    inlineImages: [],
    cta: normalizeCta(a.cta),
    ctas: a.ctas || {},
  }
}

/* The rotating call-to-action the API picked for this page view (a weighted
   pick from the article's CTA category). Null when the article has no CTA
   category or nothing live is running in it. */
function normalizeCta(cta) {
  if (!cta || !cta.title || !cta.cta_url) return null
  return {
    title: String(cta.title),
    body: String(cta.body || ''),
    label: String(cta.cta_label || 'Learn more'),
    url: String(cta.cta_url),
    image: cta.image_url || '',
  }
}

function formatCmsDate(value) {
  if (!value) return ''
  return String(value).slice(0, 10)
}

/* Editorial placeholder tokens that occasionally survive into published CMS
   bodies (e.g. a lone "CTA" line where a call-to-action was meant to go).
   Drop any paragraph that is EXACTLY one of these (trimmed, case-insensitive,
   ignoring surrounding brackets/punctuation) so they never render. We match
   the whole paragraph only, so a real sentence that happens to contain "CTA"
   is left untouched. */
const PLACEHOLDER_PARAGRAPHS = new Set([
  'cta', 'cta here', 'cta goes here', 'insert cta', 'call to action',
  'tbd', 'todo', 'placeholder', 'lorem ipsum', 'xxx',
])

function isPlaceholderParagraph(p) {
  const norm = p.toLowerCase().replace(/^[[(]+|[\])]+$/g, '').replace(/[.:]+$/, '').trim()
  return PLACEHOLDER_PARAGRAPHS.has(norm)
}

function bodyToParagraphs(body) {
  return String(body || '')
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .filter((p) => !isPlaceholderParagraph(p))
    // The legacy plain-paragraph path cannot render CTA tokens; never print them raw.
    .filter((p) => !/^\[cta:[a-z0-9\-]+(?:\|[^\]]+)?\]$/i.test(p))
}

/* Parse a CMS body into typed blocks. Supports the light Markdown the Articles
   admin produces: ## / ### headings, - or * bullet lists, 1. numbered lists,
   > quotes, and paragraphs. Inline **bold**, *italic*, `code` and [links](url)
   are handled at render time. Blank lines separate blocks. */
function parseBlocks(body) {
  const raw = String(body || '')
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean)
    .filter((b) => !isPlaceholderParagraph(b))

  return raw.map((b) => {
    const lines = b.split('\n').map((l) => l.trim()).filter(Boolean)
    // A placed CTA from the admin CTA section: [cta:slug] or [cta:slug|Button label].
    const cta = b.match(/^\[cta:([a-z0-9\-]+)(?:\|([^\]]+))?\]$/i)
    if (cta) return { type: 'cta', slug: cta[1].toLowerCase(), label: (cta[2] || '').trim() }
    const img = b.match(/^!\[(.*?)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)$/)
    if (img) return { type: 'image', alt: img[1], src: img[2], credit: img[3] || '' }
    if (/^###\s+/.test(b)) return { type: 'h3', text: b.replace(/^###\s+/, '') }
    if (/^##\s+/.test(b)) return { type: 'h2', text: b.replace(/^##\s+/, '') }
    if (/^#\s+/.test(b)) return { type: 'h2', text: b.replace(/^#\s+/, '') }
    if (lines.length && lines.every((l) => /^>\s?/.test(l))) {
      return { type: 'quote', text: lines.map((l) => l.replace(/^>\s?/, '')).join(' ') }
    }
    if (lines.length && lines.every((l) => /^[-*]\s+/.test(l))) {
      return { type: 'ul', items: lines.map((l) => l.replace(/^[-*]\s+/, '')) }
    }
    if (lines.length && lines.every((l) => /^\d+\.\s+/.test(l))) {
      return { type: 'ol', items: lines.map((l) => l.replace(/^\d+\.\s+/, '')) }
    }
    // Legacy house style writes section headings as short standalone lines
    // (no ## marker). Promote those to headings so older articles read as well
    // as ones authored with explicit Markdown.
    if (looksLikeHeading(b)) return { type: 'h2', text: b }
    return { type: 'p', text: b.replace(/\n/g, ' ') }
  })
}

/* A single short line with no sentence-ending punctuation, e.g.
   "Patterns and anticipation" or "Precision or emotion?". Deliberately strict
   so real (short) paragraphs are never mistaken for headings. */
function looksLikeHeading(text) {
  if (text.includes('\n')) return false
  if (text.length > 60) return false
  const words = text.split(/\s+/).filter(Boolean)
  if (words.length < 2 || words.length > 8) return false
  if (/[.,;:]$/.test(text)) return false
  if (!/^[A-Z"'(#]/.test(text)) return false
  return true
}

/* Inline formatting: **bold**, *italic* / _italic_, `code`, [text](url). */
function renderInline(text, keyPrefix) {
  const nodes = []
  let rest = String(text)
  let k = 0
  const re = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(_([^_]+)_)|(`([^`]+)`)|(\[([^\]]+)\]\(([^)\s]+)\))/
  while (rest.length) {
    const m = rest.match(re)
    if (!m) { nodes.push(rest); break }
    if (m.index > 0) nodes.push(rest.slice(0, m.index))
    const key = `${keyPrefix}-${k++}`
    if (m[1]) nodes.push(<strong key={key}>{m[2]}</strong>)
    else if (m[3]) nodes.push(<em key={key}>{m[4]}</em>)
    else if (m[5]) nodes.push(<em key={key}>{m[6]}</em>)
    else if (m[7]) nodes.push(<code key={key} style={{ background: 'rgba(9,32,62,0.06)', padding: '1px 6px', borderRadius: '4px', fontSize: '0.95em' }}>{m[8]}</code>)
    else if (m[9]) {
      const safeHref = /^https?:\/\//i.test(m[11]) ? m[11] : null
      nodes.push(safeHref
        ? <a key={key} href={safeHref} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-brand-accent)', textDecoration: 'underline' }}>{m[10]}</a>
        : <span key={key}>{m[10]}</span>
      )
    }
    rest = rest.slice(m.index + m[0].length)
  }
  return nodes
}

function renderBlock(b, i, ctas) {
  const key = `blk-${i}`
  if (b.type === 'cta') {
    const cta = (ctas || {})[b.slug]
    if (!cta) return null // token for a CTA that is off or gone: render nothing
    return (
      <div key={key} style={{ margin: '2.2rem 0', textAlign: 'center' }}>
        <CtaButton cta={cta} label={b.label} />
      </div>
    )
  }
  if (b.type === 'image') {
    const caption = (b.alt || '').trim()
    const credit = (b.credit || '').trim()
    return (
      <figure key={key} style={{ margin: '2.4rem 0' }}>
        <img src={b.src} alt={caption} loading="lazy" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '12px' }} />
        {(caption || credit) && (
          <figcaption className="font-body" style={{ marginTop: '0.6rem', fontSize: '0.82rem', color: '#6b7280', textAlign: 'center', fontStyle: 'italic' }}>
            {caption}
            {caption && credit ? ' ' : ''}
            {credit && <span style={{ fontStyle: 'normal', color: '#9ca3af' }}>{caption ? '· ' : ''}{credit}</span>}
          </figcaption>
        )}
      </figure>
    )
  }
  if (b.type === 'h2') {
    return <h2 key={key} className="font-heading font-bold" style={{ color: '#09203e', fontSize: '1.55rem', lineHeight: 1.25, margin: '2.4rem 0 0.9rem' }}>{renderInline(b.text, key)}</h2>
  }
  if (b.type === 'h3') {
    return <h3 key={key} className="font-heading font-bold" style={{ color: '#09203e', fontSize: '1.2rem', lineHeight: 1.3, margin: '1.9rem 0 0.6rem' }}>{renderInline(b.text, key)}</h3>
  }
  if (b.type === 'quote') {
    return <blockquote key={key} className="font-body" style={{ borderLeft: '4px solid var(--color-brand-accent)', paddingLeft: '20px', margin: '1.6rem 0', color: '#09203e', fontStyle: 'italic', fontSize: '1.12rem', lineHeight: 1.6 }}>{renderInline(b.text, key)}</blockquote>
  }
  if (b.type === 'ul') {
    return <ul key={key} className="font-body" style={{ listStyle: 'disc', paddingLeft: '1.4rem', margin: '0 0 1.4rem', color: '#333', fontSize: '1.05rem', lineHeight: 1.8 }}>{b.items.map((it, j) => <li key={j} style={{ marginBottom: '0.4rem' }}>{renderInline(it, `${key}-${j}`)}</li>)}</ul>
  }
  if (b.type === 'ol') {
    return <ol key={key} className="font-body" style={{ listStyle: 'decimal', paddingLeft: '1.4rem', margin: '0 0 1.4rem', color: '#333', fontSize: '1.05rem', lineHeight: 1.8 }}>{b.items.map((it, j) => <li key={j} style={{ marginBottom: '0.4rem' }}>{renderInline(it, `${key}-${j}`)}</li>)}</ol>
  }
  return <p key={key} className="font-body leading-[1.8] mb-5" style={{ fontSize: '1.05rem', color: '#333' }}>{renderInline(b.text, key)}</p>
}

/* The article's rotating call-to-action, rendered as a self-contained band at
   the foot of the body. Dark card on the light body background so it reads as a
   deliberate break, not another paragraph. Image is optional. */
function PromoBand({ cta }) {
  return (
    <a
      href={cta.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group"
      style={{
        display: 'flex', flexWrap: 'wrap', alignItems: 'stretch', gap: 0,
        margin: '3.5rem 0 0', borderRadius: '16px', overflow: 'hidden',
        textDecoration: 'none', background: 'linear-gradient(135deg, #09203e 0%, #050d1a 100%)',
        border: '1px solid rgba(191,177,112,0.25)', boxShadow: '0 16px 50px rgba(9,32,62,0.22)',
      }}
    >
      {cta.image && (
        <div style={{ flex: '1 1 200px', minHeight: '160px', maxWidth: '260px', overflow: 'hidden' }}>
          <img src={cta.image} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}
      <div style={{ flex: '2 1 320px', padding: 'clamp(24px,4vw,36px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <p className="font-mono uppercase tracking-[0.15em]" style={{ fontSize: '0.62rem', color: 'var(--color-brand-accent)', fontWeight: 600, marginBottom: '10px' }}>
          Soccerex
        </p>
        <h3 className="font-heading font-bold text-white leading-snug" style={{ fontSize: 'clamp(1.25rem,2.5vw,1.6rem)', marginBottom: cta.body ? '10px' : '18px' }}>
          {cta.title}
        </h3>
        {cta.body && (
          <p className="font-body" style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '18px' }}>
            {cta.body}
          </p>
        )}
        <span
          className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.1em] self-start"
          style={{
            fontSize: '0.78rem', color: '#09203e', background: 'var(--color-brand-accent)',
            padding: '11px 22px', borderRadius: '8px', transition: 'transform 0.2s',
          }}
        >
          {cta.label} <ArrowRight size={14} />
        </span>
      </div>
    </a>
  )
}

function uniqueLabels(values) {
  const seen = new Set()
  return values
    .map((value) => String(value || '').trim())
    .filter((value) => {
      if (!value || seen.has(value)) return false
      seen.add(value)
      return true
    })
}
