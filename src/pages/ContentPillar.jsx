import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, Calendar, Loader2, AlertCircle,
  Briefcase, Camera, Hash, Target, Compass, Users, Megaphone, FileText,
} from 'lucide-react'
import {
  getContentPillar, getSocialPostsByPillar, ApiError,
} from '../lib/soccerexApi'
import { isTestModeFromUrl, withTestSearch } from '../lib/testMode'

const PLATFORMS = [
  { key: 'linkedin',  label: 'LinkedIn',  Icon: Briefcase },
  { key: 'instagram', label: 'Instagram', Icon: Camera },
  { key: 'x',         label: 'X',         Icon: Hash },
]

export default function ContentPillar() {
  const { slug } = useParams()
  const [pillar, setPillar] = useState(null)
  const [error, setError] = useState(null)
  const [activePlatform, setActivePlatform] = useState('linkedin')
  const [platformPosts, setPlatformPosts] = useState({}) /* { linkedin: [...], instagram: [...] } */
  const [platformLoading, setPlatformLoading] = useState(false)

  useEffect(() => { window.scrollTo(0, 0) }, [slug])

  /* Pillar detail includes the anchor article, articles[] and social_posts[]
     so the first paint covers everything. Per-platform refresh below uses
     the dedicated endpoint when the user switches tabs and a platform
     hasn't been loaded yet. */
  useEffect(() => {
    let cancelled = false
    setPillar(null); setError(null); setPlatformPosts({})
    getContentPillar(slug, { test: isTestModeFromUrl() })
      .then((data) => { if (!cancelled) setPillar(data) })
      .catch((err) => { if (!cancelled) setError(err) })
    return () => { cancelled = true }
  }, [slug])

  /* Pre-bucket the bundled social_posts by platform so the LinkedIn tab
     paints instantly without a second round-trip. */
  const bundled = useMemo(() => {
    const buckets = { linkedin: [], instagram: [], x: [] }
    ;(pillar?.social_posts || []).forEach((p) => {
      const key = (p.platform || '').toLowerCase()
      if (buckets[key]) buckets[key].push(p)
    })
    return buckets
  }, [pillar])

  /* When the user switches platforms, prefer the per-platform endpoint
     for an authoritative list. Cache by platform key. */
  useEffect(() => {
    if (!pillar) return
    if (platformPosts[activePlatform]) return /* cached */
    let cancelled = false
    setPlatformLoading(true)
    getSocialPostsByPillar(slug, activePlatform, { test: isTestModeFromUrl() })
      .then((data) => {
        if (cancelled) return
        setPlatformPosts((prev) => ({ ...prev, [activePlatform]: Array.isArray(data) ? data : [] }))
      })
      .catch(() => { /* fall back to bundled */ })
      .finally(() => { if (!cancelled) setPlatformLoading(false) })
    return () => { cancelled = true }
  }, [pillar, slug, activePlatform, platformPosts])

  if (error) {
    return (
      <div style={{ background: '#050d1a', minHeight: '100vh', padding: 'clamp(80px,10vw,140px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <Link to={withTestSearch('/pillars')} className="inline-flex items-center gap-2 font-mono uppercase mb-8" style={{ fontSize: 11, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>
            <ArrowLeft size={13} /> All pillars
          </Link>
          <div className="flex items-start gap-3 p-5" style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.25)' }}>
            <AlertCircle size={20} style={{ color: '#fca5a5', flexShrink: 0 }} />
            <div>
              <p className="font-heading font-bold" style={{ fontSize: 16, color: '#fff' }}>This pillar isn't available</p>
              <p className="font-body mt-1" style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
                {error instanceof ApiError ? error.message : 'Try again, or pick another pillar.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!pillar) {
    return (
      <div style={{ background: '#050d1a', minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <span className="font-mono uppercase flex items-center gap-3" style={{ fontSize: 12, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.6)' }}>
          <Loader2 size={18} className="prog-spin" /> Loading pillar
        </span>
      </div>
    )
  }

  const articles = Array.isArray(pillar.articles) ? pillar.articles : []
  const anchor = pillar.anchor_article
  /* Prefer per-platform endpoint when loaded; fall back to the bundled list. */
  const visiblePosts = platformPosts[activePlatform] ?? bundled[activePlatform]

  return (
    <div style={{ background: '#050d1a', minHeight: '100vh' }}>
      {/* ─── Header ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ padding: 'clamp(80px,9vw,140px) clamp(24px,5vw,80px) clamp(60px,8vw,100px)' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at top, #0d2b52 0%, #050d1a 70%)' }} />
        <div className="relative z-10" style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Link to={withTestSearch('/pillars')} className="inline-flex items-center gap-2 font-mono uppercase mb-6" style={{ fontSize: 11, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>
            <ArrowLeft size={13} /> All pillars
          </Link>
          <p className="section-label text-gold mb-4">{pillar.audience || 'Strategy pillar'}</p>
          <h1 className="font-heading font-bold text-white leading-[1.05] mb-6" style={{ fontSize: 'clamp(2rem, 5vw, 3.6rem)' }}>
            {pillar.name}
          </h1>
          {pillar.summary && (
            <p className="font-body text-white/75 leading-relaxed" style={{ fontSize: 'clamp(1rem, 1.4vw, 1.15rem)', maxWidth: 760 }}>
              {pillar.summary}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-10">
            {pillar.audience && <StratTile Icon={Users} label="Audience" value={pillar.audience} />}
            {pillar.business_goal && <StratTile Icon={Target} label="Business goal" value={pillar.business_goal} />}
            {pillar.conversion_goal && <StratTile Icon={Compass} label="Conversion goal" value={pillar.conversion_goal} />}
            {pillar.primary_cta && <StratTile Icon={Megaphone} label="Primary CTA" value={pillar.primary_cta} href={pillar.landing_page_url} />}
          </div>

          {(Array.isArray(pillar.channels) && pillar.channels.length > 0) || (Array.isArray(pillar.social_formats) && pillar.social_formats.length > 0) ? (
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-6">
              {Array.isArray(pillar.channels) && pillar.channels.length > 0 && (
                <span className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.55)' }}>
                  Channels: <span style={{ color: '#fff' }}>{pillar.channels.join(' · ')}</span>
                </span>
              )}
              {Array.isArray(pillar.social_formats) && pillar.social_formats.length > 0 && (
                <span className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.55)' }}>
                  Formats: <span style={{ color: '#fff' }}>{pillar.social_formats.join(' · ')}</span>
                </span>
              )}
            </div>
          ) : null}
        </div>
      </section>

      {/* ─── Anchor article ─────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(180deg, #f4f3f0 0%, #eae8e4 100%)', padding: 'clamp(60px,8vw,100px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <SectionHeading kicker="Anchor" title="The flagship article" />
          {anchor ? (
            <ArticleCard article={anchor} large />
          ) : (
            <EmptyState
              icon={FileText}
              title="Anchor article in production"
              body={`We're finalising the long-form anchor for "${pillar.name}". In the meantime, the satellite content below extends the same strategy.`}
            />
          )}

          {/* Supporting articles */}
          {articles.length > 0 && (
            <div className="mt-14">
              <SectionHeading kicker="Long-form" title="Supporting articles" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {articles.map((a) => <ArticleCard key={a.slug || a.id} article={a} />)}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── Social posts ───────────────────────────────────────── */}
      <section style={{ background: '#0a1628', padding: 'clamp(60px,8vw,100px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p className="font-mono uppercase mb-2" style={{ fontSize: 10, letterSpacing: '0.24em', color: 'var(--color-gold)' }}>Satellites</p>
          <h2 className="font-heading font-bold mb-8" style={{ fontSize: 'clamp(1.4rem, 2.6vw, 2rem)', color: '#fff' }}>
            Platform-ready social posts
          </h2>

          <div className="flex flex-wrap gap-2 mb-8">
            {PLATFORMS.map(({ key, label, Icon }) => {
              const active = key === activePlatform
              return (
                <button key={key} onClick={() => setActivePlatform(key)}
                  className="inline-flex items-center gap-2 font-body font-semibold uppercase cursor-pointer border-none"
                  style={{
                    background: active ? 'var(--color-gold)' : 'rgba(255,255,255,0.06)',
                    color: active ? '#09203e' : 'rgba(255,255,255,0.85)',
                    padding: '10px 18px',
                    fontSize: 12,
                    letterSpacing: '0.15em',
                    transition: 'all 0.15s',
                  }}>
                  <Icon size={14} /> {label}
                </button>
              )
            })}
          </div>

          {platformLoading && (!visiblePosts || visiblePosts.length === 0) ? (
            <p className="font-mono uppercase flex items-center gap-3" style={{ fontSize: 11, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.6)' }}>
              <Loader2 size={14} className="prog-spin" /> Loading {activePlatform}
            </p>
          ) : visiblePosts && visiblePosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {visiblePosts.map((post, i) => <SocialPostCard key={post.id || post.slug || i} post={post} />)}
            </div>
          ) : (
            <EmptyState
              dark
              icon={Megaphone}
              title={`No ${activePlatform} posts yet`}
              body="The social plan for this platform is still being drafted."
            />
          )}
        </div>
      </section>
    </div>
  )
}

function SectionHeading({ kicker, title }) {
  return (
    <div className="mb-8">
      <p className="font-mono uppercase mb-2" style={{ fontSize: 10, letterSpacing: '0.24em', color: 'var(--color-gold)' }}>{kicker}</p>
      <h2 className="font-heading font-bold" style={{ fontSize: 'clamp(1.4rem, 2.6vw, 2rem)', color: '#09203e' }}>{title}</h2>
    </div>
  )
}

function StratTile({ Icon, label, value, href }) {
  const body = (
    <>
      <div className="flex items-center gap-2 mb-2">
        <Icon size={14} style={{ color: 'var(--color-gold)' }} />
        <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.55)' }}>{label}</span>
      </div>
      <p className="font-body" style={{ fontSize: '0.95rem', color: '#fff' }}>{value}</p>
    </>
  )
  const baseStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.10)',
    padding: 18,
    textDecoration: 'none',
  }
  return href
    ? <a href={href} target="_blank" rel="noreferrer" style={baseStyle}>{body}</a>
    : <div style={baseStyle}>{body}</div>
}

function ArticleCard({ article, large }) {
  /* Anchor + supporting article shape is the API's `articles[].` Each item
     is assumed to expose at minimum slug, title, excerpt or summary, and
     optionally published_at, hero_image_url, read_time, type. */
  const title = article.title || article.name || 'Untitled'
  const excerpt = article.excerpt || article.summary || article.dek || ''
  const date = article.published_at || article.date
  const href = article.url || (article.slug ? withTestSearch(`/insights/${article.slug}`) : null)
  const image = article.hero_image_url || article.featured_image || article.image
  const isExternal = href && /^https?:\/\//.test(href)

  const Wrapper = ({ children }) => href
    ? (isExternal
      ? <a href={href} target="_blank" rel="noreferrer" style={cardStyle(large)}>{children}</a>
      : <Link to={href} style={cardStyle(large)}>{children}</Link>)
    : <div style={cardStyle(large)}>{children}</div>

  return (
    <Wrapper>
      {image && (
        <div style={{ aspectRatio: large ? '16/7' : '16/9', overflow: 'hidden', marginBottom: 16 }}>
          <img src={image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3 mb-3">
        {article.type && (
          <span className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.18em', color: 'var(--color-gold)', background: 'rgba(191,177,112,0.12)', padding: '3px 8px' }}>
            {article.type}
          </span>
        )}
        {date && (
          <span className="flex items-center gap-1.5 font-mono" style={{ fontSize: 11, color: '#888' }}>
            <Calendar size={11} /> {date}
          </span>
        )}
      </div>
      <h3 className="font-heading font-bold leading-snug mb-3" style={{ fontSize: large ? 'clamp(1.4rem, 2.6vw, 1.9rem)' : '1.15rem', color: '#09203e' }}>
        {title}
      </h3>
      {excerpt && (
        <p className="font-body leading-relaxed" style={{ fontSize: large ? '1rem' : '0.92rem', color: '#3a4a5a' }}>
          {excerpt.length > 240 ? `${excerpt.slice(0, 240)}…` : excerpt}
        </p>
      )}
      {href && (
        <div className="flex items-center gap-2 mt-4" style={{ color: 'var(--color-gold)' }}>
          <span className="font-body font-semibold uppercase tracking-[0.15em]" style={{ fontSize: '0.78rem' }}>Read article</span>
          <ArrowRight size={14} />
        </div>
      )}
    </Wrapper>
  )
}

function cardStyle(large) {
  return {
    display: 'block',
    background: '#FFFFFF',
    border: '1px solid rgba(9,32,62,0.08)',
    padding: large ? 32 : 24,
    textDecoration: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  }
}

function SocialPostCard({ post }) {
  const tags = Array.isArray(post.tags) ? post.tags : []
  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', padding: 24 }}>
      {post.hook && (
        <p className="font-heading font-bold mb-3" style={{ fontSize: '1.05rem', color: '#fff', lineHeight: 1.35 }}>
          {post.hook}
        </p>
      )}
      {(post.caption || post.body) && (
        <p className="font-body leading-relaxed mb-4" style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.78)', whiteSpace: 'pre-wrap' }}>
          {post.caption || post.body}
        </p>
      )}
      {post.asset_brief && (
        <div style={{ background: 'rgba(0,0,0,0.25)', borderLeft: '2px solid var(--color-gold)', padding: '10px 14px', marginBottom: 14 }}>
          <p className="font-mono uppercase mb-1" style={{ fontSize: 9, letterSpacing: '0.22em', color: 'var(--color-gold)' }}>Asset brief</p>
          <p className="font-body" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)' }}>{post.asset_brief}</p>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
        {post.cta && (
          <span className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.2em', color: '#09203e', background: 'var(--color-gold)', padding: '4px 10px' }}>
            {post.cta}
          </span>
        )}
        {tags.length > 0 && (
          <span className="font-mono" style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>
            {tags.map((t) => `#${String(t).replace(/^#/, '')}`).join(' ')}
          </span>
        )}
      </div>
      {post.article && (post.article.slug || post.article.url) && (
        post.article.url ? (
          <a href={post.article.url} target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 mt-4"
            style={{ fontSize: 11, color: 'var(--color-gold)', textDecoration: 'none' }}>
            <FileText size={12} /> Linked to: {post.article.title || post.article.slug}
          </a>
        ) : (
          <Link to={withTestSearch(`/insights/${post.article.slug}`)}
            className="inline-flex items-center gap-2 mt-4"
            style={{ fontSize: 11, color: 'var(--color-gold)', textDecoration: 'none' }}>
            <FileText size={12} /> Linked to: {post.article.title || post.article.slug}
          </Link>
        )
      )}
    </div>
  )
}

function EmptyState({ icon: Icon, title, body, dark }) {
  return (
    <div style={{
      background: dark ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
      border: `1px dashed ${dark ? 'rgba(255,255,255,0.18)' : 'rgba(9,32,62,0.15)'}`,
      padding: 36,
      textAlign: 'center',
    }}>
      <Icon size={28} style={{ color: dark ? 'rgba(255,255,255,0.5)' : '#607186', margin: '0 auto 14px' }} />
      <p className="font-heading font-bold mb-2" style={{ fontSize: '1.1rem', color: dark ? '#fff' : '#09203e' }}>{title}</p>
      <p className="font-body" style={{ fontSize: '0.92rem', color: dark ? 'rgba(255,255,255,0.7)' : '#555', maxWidth: 520, margin: '0 auto' }}>{body}</p>
    </div>
  )
}
