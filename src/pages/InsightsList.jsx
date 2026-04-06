import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Search, Calendar } from 'lucide-react'
import NetworkNodes from '../animations/NetworkNodes'
import PixelDivider from '../components/PixelDivider'

function useScrollAnimations(dep) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible') }) },
      { threshold: 0.01, rootMargin: '0px 0px 200px 0px' }
    )
    document.querySelectorAll('.fade-up, .scale-up').forEach((el) => {
      if (!el.classList.contains('visible')) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [dep])
}

const PAGE_SIZE = 12

export default function InsightsList() {
  const [articles, setArticles] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => { window.scrollTo(0, 0) }, [])

  useEffect(() => {
    fetch('/insights-manifest.json')
      .then((r) => r.json())
      .then(setArticles)
  }, [])

  // Reset page when filter/search changes
  useEffect(() => { setPage(1) }, [activeCategory, searchQuery])

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set()
    articles.forEach((a) => a.categories.forEach((c) => cats.add(c)))
    return ['All', ...Array.from(cats).sort()]
  }, [articles])

  // Filter and search
  const filtered = useMemo(() => {
    let result = articles
    if (activeCategory !== 'All') {
      result = result.filter((a) => a.categories.includes(activeCategory))
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter((a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.categories.some((c) => c.toLowerCase().includes(q))
      )
    }
    return result
  }, [articles, activeCategory, searchQuery])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const visible = filtered.slice(0, page * PAGE_SIZE)
  const hasMore = page * PAGE_SIZE < filtered.length

  useScrollAnimations(visible.length)

  // Featured article = first article with a featured image
  const featured = articles.find((a) => a.featuredImage) || articles[0]

  if (!articles.length) {
    return <div style={{ minHeight: '100vh', background: '#050d1a' }} />
  }

  return (
    <div style={{ background: '#050d1a' }}>

      {/* ═══ HERO ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden flex items-center justify-center" style={{ minHeight: '60vh' }}>
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at top, #0d2b52 0%, #050d1a 70%)',
        }} />
        <NetworkNodes color="#bfb170" nodeCount={30} opacity={0.15} />
        <div className="absolute pointer-events-none" style={{ top: '15%', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '800px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(191,177,112,0.1) 0%, transparent 60%)' }} />
        <div className="relative z-10 text-center" style={{ maxWidth: '900px', padding: 'clamp(140px,15vw,200px) clamp(24px,5vw,80px) clamp(60px,8vw,100px)' }}>
          <p className="section-label text-gold mb-5 fade-up">INSIGHTS</p>
          <h1 className="font-heading font-bold text-white leading-[1.05] mb-6 fade-up text-glow" style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4.5rem)' }}>
            The Football Industry's{' '}
            <span style={{ color: 'var(--color-gold)' }}>Pulse</span>
          </h1>
          <div className="fade-up mx-auto mb-6" style={{ width: '100px', height: '3px', background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)' }} />
          <p className="font-body text-white/70 leading-relaxed fade-up mx-auto" style={{ fontSize: 'clamp(1rem, 1.4vw, 1.15rem)', maxWidth: '640px' }}>
            Keeping abreast of the rapidly changing football business environment is key. The latest trends and updates from influential industry players.
          </p>
        </div>
      </section>

      <PixelDivider color="#f4f3f0" layers={4} height={90} speed={0.5} />

      {/* ═══ FEATURED ARTICLE ═══════════════════════════════════════════════ */}
      {featured && featured.featuredImage && (
        <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #f4f3f0 0%, #eae8e4 100%)', padding: 'clamp(80px,10vw,120px) clamp(24px,5vw,80px) 0' }}>
          <div className="relative z-10" style={{ maxWidth: '1300px', margin: '0 auto' }}>
            <Link to={`/insights/${featured.slug}`} className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch fade-up" style={{ textDecoration: 'none', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 30px 80px rgba(9,32,62,0.15)', transition: 'transform 0.3s, box-shadow 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 40px 100px rgba(9,32,62,0.22)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 30px 80px rgba(9,32,62,0.15)' }}
            >
              <div style={{ position: 'relative', minHeight: '360px', overflow: 'hidden' }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: `url(${featured.featuredImage})`,
                  backgroundSize: 'cover', backgroundPosition: 'center',
                  transition: 'transform 0.6s',
                }} />
              </div>
              <div style={{ background: '#09203e', padding: 'clamp(36px,5vw,56px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-mono uppercase tracking-[0.15em]" style={{ fontSize: '0.65rem', color: '#bfb170', fontWeight: 600 }}>FEATURED</span>
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} />
                  <span className="font-mono uppercase tracking-[0.1em]" style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>{featured.date}</span>
                </div>
                <h2 className="font-heading font-bold text-white leading-tight mb-4" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>
                  {featured.title}
                </h2>
                <p className="font-body leading-relaxed mb-6" style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.7)' }}>
                  {featured.excerpt.slice(0, 200)}...
                </p>
                <span className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.15em]" style={{ fontSize: '0.8rem', color: '#bfb170' }}>
                  Read Article <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* ═══ FILTERS + SEARCH ═══════════════════════════════════════════════ */}
      <section className="relative" style={{ background: 'linear-gradient(180deg, #eae8e4 0%, #f4f3f0 100%)', padding: 'clamp(60px,8vw,100px) clamp(24px,5vw,80px) 40px' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 mb-8 fade-up">
            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="font-mono uppercase tracking-[0.1em] cursor-pointer border-none transition-all duration-200"
                  style={{
                    fontSize: '0.7rem',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontWeight: 600,
                    background: cat === activeCategory ? '#09203e' : 'rgba(9,32,62,0.06)',
                    color: cat === activeCategory ? '#fff' : '#09203e',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
            {/* Search */}
            <div style={{ position: 'relative', minWidth: '260px' }}>
              <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#bfb170', pointerEvents: 'none' }} />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%', padding: '12px 14px 12px 40px',
                  fontSize: '0.9rem', fontFamily: 'Inter, sans-serif',
                  background: '#fff', border: '1px solid rgba(9,32,62,0.12)',
                  borderRadius: '10px', color: '#09203e', outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#bfb170' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(9,32,62,0.12)' }}
              />
            </div>
          </div>

          {/* Results count */}
          <p className="font-body mb-6 fade-up" style={{ fontSize: '0.85rem', color: '#888' }}>
            {filtered.length} article{filtered.length !== 1 ? 's' : ''}
            {activeCategory !== 'All' && ` in ${activeCategory}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>
      </section>

      {/* ═══ ARTICLE GRID ═══════════════════════════════════════════════════ */}
      <section style={{ background: 'linear-gradient(180deg, #f4f3f0 0%, #eae8e4 100%)', padding: '0 clamp(24px,5vw,80px) clamp(100px,12vw,160px)' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
          {visible.length === 0 ? (
            <div className="text-center py-20 fade-up">
              <p className="font-heading font-bold" style={{ fontSize: '1.5rem', color: '#09203e', marginBottom: '8px' }}>No articles found</p>
              <p className="font-body" style={{ color: '#666' }}>Try a different category or search term.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visible.map((article, i) => (
                  <ArticleCard key={article.id} article={article} index={i} />
                ))}
              </div>
              {hasMore && (
                <div className="text-center mt-12 fade-up">
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.15em] cursor-pointer border-none"
                    style={{ background: '#09203e', color: '#fff', padding: '16px 36px', fontSize: '0.85rem', transition: 'all 0.3s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#0d2b52' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#09203e' }}
                  >
                    Load more <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}

// ─── Article card ────────────────────────────────────────────────────────────
function ArticleCard({ article, index }) {
  const hasImage = !!article.featuredImage
  return (
    <Link to={`/insights/${article.slug}`} className="scale-up group block" style={{ textDecoration: 'none', transitionDelay: `${(index % 6) * 40}ms` }}>
      <div style={{
        background: '#fff',
        borderRadius: '14px',
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid rgba(9,32,62,0.06)',
        boxShadow: '0 8px 30px rgba(9,32,62,0.06)',
        transition: 'transform 0.3s, box-shadow 0.3s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 50px rgba(9,32,62,0.15)' }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(9,32,62,0.06)' }}
      >
        {/* Image */}
        <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden', background: '#09203e' }}>
          {hasImage ? (
            <img src={article.featuredImage} alt="" loading="lazy" style={{
              width: '100%', height: '100%', objectFit: 'cover', display: 'block',
              transition: 'transform 0.5s', filter: 'saturate(0.9)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.06)' }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="font-heading font-bold" style={{ fontSize: '3rem', color: 'rgba(191,177,112,0.15)' }}>SX</span>
            </div>
          )}
          {/* Category badge */}
          {article.categories[0] && article.categories[0] !== 'Uncategorized' && (
            <span style={{
              position: 'absolute', top: '12px', left: '12px',
              background: 'rgba(9,32,62,0.85)', backdropFilter: 'blur(8px)',
              color: '#bfb170', padding: '5px 12px', borderRadius: '6px',
              fontSize: '0.65rem', fontFamily: '"IBM Plex Mono", monospace',
              fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em',
            }}>
              {article.categories[0]}
            </span>
          )}
        </div>
        {/* Content */}
        <div style={{ padding: '22px 22px 28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={12} style={{ color: '#bfb170' }} />
            <span className="font-mono" style={{ fontSize: '0.68rem', color: '#888', letterSpacing: '0.05em' }}>{article.date}</span>
          </div>
          <h3 className="font-heading font-bold leading-snug mb-3" style={{ fontSize: '1.1rem', color: '#09203e', flex: 1 }}>
            {article.title}
          </h3>
          <p className="font-body leading-relaxed" style={{ fontSize: '0.88rem', color: '#666', marginBottom: '16px' }}>
            {article.excerpt.slice(0, 140)}...
          </p>
          <span className="inline-flex items-center gap-1.5 font-body font-semibold uppercase tracking-[0.12em] mt-auto" style={{ fontSize: '0.75rem', color: '#bfb170' }}>
            Read <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </Link>
  )
}
