import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Search, Calendar, Mail, ChevronRight } from 'lucide-react'
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

const PAGE_SIZE = 15

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

  useEffect(() => { setPage(1) }, [activeCategory, searchQuery])

  // Unique categories (hide Uncategorized)
  const categories = useMemo(() => {
    const cats = new Set()
    articles.forEach((a) => a.categories.forEach((c) => { if (c !== 'Uncategorized') cats.add(c) }))
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

  const visible = filtered.slice(0, page * PAGE_SIZE)
  const hasMore = page * PAGE_SIZE < filtered.length

  useScrollAnimations(visible.length)

  if (!articles.length) {
    return <div style={{ minHeight: '100vh', background: '#050d1a' }} />
  }

  return (
    <div style={{ background: '#050d1a' }}>

      {/* ═══ HERO ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden flex items-center justify-center" style={{ minHeight: '50vh' }}>
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at top, #0d2b52 0%, #050d1a 70%)',
        }} />
        <NetworkNodes color="#bfb170" nodeCount={30} opacity={0.15} />
        <div className="relative z-10 text-center" style={{ maxWidth: '900px', padding: 'clamp(140px,15vw,200px) clamp(24px,5vw,80px) clamp(60px,8vw,100px)' }}>
          <p className="section-label text-gold mb-5 fade-up">INSIGHTS</p>
          <h1 className="font-heading font-bold text-white leading-[1.05] mb-6 fade-up text-glow" style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4.5rem)' }}>
            The Football Industry's{' '}
            <span style={{ color: 'var(--color-gold)' }}>Pulse</span>
          </h1>
          <div className="fade-up mx-auto mb-6" style={{ width: '100px', height: '3px', background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)' }} />
          <p className="font-body text-white/70 leading-relaxed fade-up mx-auto" style={{ fontSize: 'clamp(1rem, 1.4vw, 1.15rem)', maxWidth: '640px' }}>
            The latest trends and updates from influential industry players. Your one-stop solution for all football industry news.
          </p>
        </div>
      </section>

      <PixelDivider color="#f4f3f0" layers={4} height={90} speed={0.5} />

      {/* ═══ MAIN CONTENT (2-column: articles + sidebar) ═══════════════════ */}
      <section style={{ background: 'linear-gradient(180deg, #f4f3f0 0%, #eae8e4 100%)', padding: 'clamp(60px,8vw,100px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* LEFT COLUMN: Article list */}
            <div className="lg:col-span-2">
              {/* Results info */}
              <p className="font-body mb-8 fade-up" style={{ fontSize: '0.85rem', color: '#888' }}>
                {filtered.length} article{filtered.length !== 1 ? 's' : ''}
                {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
                {searchQuery ? ` matching "${searchQuery}"` : ''}
              </p>

              {visible.length === 0 ? (
                <div className="text-center py-20 fade-up">
                  <p className="font-heading font-bold" style={{ fontSize: '1.5rem', color: '#09203e', marginBottom: '8px' }}>No articles found</p>
                  <p className="font-body" style={{ color: '#666' }}>Try a different category or search term.</p>
                </div>
              ) : (
                <div>
                  {visible.map((article, i) => (
                    <ArticleRow key={article.id} article={article} index={i} />
                  ))}
                  {hasMore && (
                    <div className="text-center mt-10 fade-up">
                      <button
                        onClick={() => setPage((p) => p + 1)}
                        className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.15em] cursor-pointer border-none"
                        style={{ background: '#09203e', color: '#fff', padding: '14px 32px', fontSize: '0.82rem', transition: 'all 0.3s' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#0d2b52' }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = '#09203e' }}
                      >
                        Load more <ArrowRight size={14} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="lg:col-span-1">
              {/* Search */}
              <div className="mb-8 fade-up">
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#bfb170', pointerEvents: 'none' }} />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%', padding: '13px 14px 13px 42px',
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

              {/* SoccerExpert Subscribe */}
              <div className="fade-up" style={{
                background: '#09203e',
                borderRadius: '16px',
                padding: '32px 28px',
                marginBottom: '32px',
              }}>
                <h3 className="font-heading font-bold text-white mb-2" style={{ fontSize: '1.5rem', letterSpacing: '-0.01em' }}>
                  SOCCER<span style={{ color: '#bfb170' }}>EXPERT</span>
                </h3>
                <p className="font-mono uppercase tracking-[0.12em] mb-4" style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.45)' }}>
                  THE FOOTBALL BUSINESS E-NEWSLETTER
                </p>
                <p className="font-body leading-relaxed mb-6" style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
                  Subscribe to get the latest commercial details, groundbreaking interviews, and industry analysis, free, straight to your inbox.
                </p>
                <form onSubmit={(e) => { e.preventDefault(); const email = e.target.email.value; window.location.href = `mailto:enquiries@soccerex.com?subject=SoccerExpert%20Subscribe&body=Please%20add%20${encodeURIComponent(email)}%20to%20the%20SoccerExpert%20newsletter.` }}>
                  <input
                    name="email"
                    type="email"
                    placeholder="Your Email Address"
                    required
                    style={{
                      width: '100%', padding: '13px 14px',
                      fontSize: '0.9rem', fontFamily: 'Inter, sans-serif',
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(191,177,112,0.25)',
                      borderRadius: '8px', color: '#fff', outline: 'none',
                      marginBottom: '12px', transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#bfb170' }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(191,177,112,0.25)' }}
                  />
                  <button type="submit" className="inline-flex items-center justify-center gap-2 font-body font-semibold uppercase tracking-[0.15em] w-full cursor-pointer border-none"
                    style={{ background: '#bfb170', color: '#09203e', padding: '14px 24px', fontSize: '0.82rem', borderRadius: '8px', transition: 'all 0.3s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#d4c78e' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#bfb170' }}
                  >
                    <Mail size={15} /> Subscribe
                  </button>
                </form>
              </div>

              {/* Categories */}
              <div className="fade-up" style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '28px',
                border: '1px solid rgba(9,32,62,0.06)',
                boxShadow: '0 8px 24px rgba(9,32,62,0.05)',
                marginBottom: '32px',
              }}>
                <h4 className="font-heading font-bold mb-5" style={{ fontSize: '1.1rem', color: '#09203e' }}>Categories</h4>
                <div className="flex flex-col gap-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className="flex items-center justify-between cursor-pointer border-none text-left w-full transition-all duration-200"
                      style={{
                        padding: '10px 14px',
                        borderRadius: '8px',
                        fontSize: '0.88rem',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: cat === activeCategory ? 600 : 400,
                        background: cat === activeCategory ? '#09203e' : 'transparent',
                        color: cat === activeCategory ? '#fff' : '#444',
                      }}
                      onMouseEnter={(e) => { if (cat !== activeCategory) e.currentTarget.style.background = 'rgba(9,32,62,0.05)' }}
                      onMouseLeave={(e) => { if (cat !== activeCategory) e.currentTarget.style.background = 'transparent' }}
                    >
                      {cat}
                      {cat === activeCategory && <ChevronRight size={14} style={{ color: '#bfb170' }} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Posts */}
              <div className="fade-up" style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '28px',
                border: '1px solid rgba(9,32,62,0.06)',
                boxShadow: '0 8px 24px rgba(9,32,62,0.05)',
              }}>
                <h4 className="font-heading font-bold mb-5" style={{ fontSize: '1.1rem', color: '#09203e' }}>Recent Posts</h4>
                <div className="flex flex-col gap-4">
                  {articles.slice(0, 5).map((a) => (
                    <Link key={a.id} to={`/insights/${a.slug}`} className="group block" style={{ textDecoration: 'none' }}>
                      <p className="font-mono uppercase" style={{ fontSize: '0.62rem', color: '#bfb170', letterSpacing: '0.1em', marginBottom: '4px' }}>{a.date}</p>
                      <p className="font-heading font-bold leading-snug transition-colors duration-200" style={{ fontSize: '0.88rem', color: '#09203e' }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#bfb170' }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = '#09203e' }}
                      >
                        {a.title}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// ─── Article row (text-forward, like the live site) ─────────────────────────
function ArticleRow({ article, index }) {
  const displayCats = article.categories.filter((c) => c !== 'Uncategorized')
  return (
    <div className="fade-up" style={{ marginBottom: '40px', paddingBottom: '40px', borderBottom: '1px solid rgba(9,32,62,0.08)' }}>
      {/* Category + date */}
      <div className="flex flex-wrap items-center gap-3 mb-3">
        {displayCats.map((cat) => (
          <span key={cat} className="font-mono uppercase tracking-[0.12em]" style={{
            fontSize: '0.62rem', color: '#bfb170', fontWeight: 600,
            background: 'rgba(191,177,112,0.1)', padding: '4px 10px', borderRadius: '4px',
          }}>
            {cat}
          </span>
        ))}
        <span className="flex items-center gap-1.5 font-mono" style={{ fontSize: '0.68rem', color: '#888' }}>
          <Calendar size={11} /> {article.date}
        </span>
      </div>

      {/* Title */}
      <Link to={`/insights/${article.slug}`} style={{ textDecoration: 'none' }}>
        <h2 className="font-heading font-bold leading-snug mb-3 transition-colors duration-200" style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)', color: '#09203e' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#bfb170' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#09203e' }}
        >
          {article.title}
        </h2>
      </Link>

      {/* Excerpt */}
      <p className="font-body leading-relaxed mb-5" style={{ fontSize: '0.95rem', color: '#555' }}>
        {article.excerpt.slice(0, 220)}...
      </p>

      {/* Read link */}
      <Link to={`/insights/${article.slug}`} className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.15em]"
        style={{ fontSize: '0.78rem', color: '#bfb170', textDecoration: 'none', transition: 'color 0.2s' }}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#09203e' }}
        onMouseLeave={(e) => { e.currentTarget.style.color = '#bfb170' }}
      >
        Continue Reading <ArrowRight size={14} />
      </Link>
    </div>
  )
}
