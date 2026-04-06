import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Calendar, Tag } from 'lucide-react'
import NetworkNodes from '../animations/NetworkNodes'
import PixelDivider from '../components/PixelDivider'

export default function InsightArticle() {
  const { slug } = useParams()
  const [article, setArticle] = useState(null)
  const [allArticles, setAllArticles] = useState([])

  useEffect(() => { window.scrollTo(0, 0) }, [slug])

  useEffect(() => {
    fetch('/insights-manifest.json')
      .then((r) => r.json())
      .then((data) => {
        setAllArticles(data)
        const found = data.find((a) => a.slug === slug)
        setArticle(found || null)
      })
  }, [slug])

  if (!article) {
    return <div style={{ minHeight: '100vh', background: '#050d1a' }} />
  }

  // Related articles: same category, not self, max 3
  const related = allArticles
    .filter((a) => a.slug !== slug && a.categories.some((c) => article.categories.includes(c)))
    .slice(0, 3)

  return (
    <div style={{ background: '#050d1a' }}>

      {/* ═══ HERO ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ minHeight: article.featuredImage ? '55vh' : '40vh' }}>
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
        <NetworkNodes color="#bfb170" nodeCount={25} opacity={0.12} />

        <div className="relative z-10 flex flex-col items-center justify-end" style={{ minHeight: article.featuredImage ? '50vh' : '40vh', padding: 'clamp(130px,12vw,170px) clamp(24px,5vw,80px) clamp(50px,6vw,80px)' }}>
          <div style={{ maxWidth: '860px', textAlign: 'center' }}>
            <div className="flex flex-wrap items-center justify-center gap-3 mb-5">
              {article.categories.filter((c) => c !== 'Uncategorized').map((cat) => (
                <span key={cat} className="font-mono uppercase tracking-[0.15em]" style={{
                  fontSize: '0.65rem', color: '#bfb170', fontWeight: 600,
                  background: 'rgba(191,177,112,0.12)', padding: '5px 14px', borderRadius: '6px',
                  border: '1px solid rgba(191,177,112,0.2)',
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

      <PixelDivider color="#f4f3f0" layers={4} height={90} speed={0.5} />

      {/* ═══ ARTICLE BODY ═══════════════════════════════════════════════════ */}
      <section style={{ background: 'linear-gradient(180deg, #f4f3f0 0%, #eae8e4 100%)', padding: 'clamp(60px,8vw,100px) clamp(24px,5vw,80px) clamp(100px,12vw,160px)' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          {/* Back link */}
          <Link to="/insights" className="inline-flex items-center gap-2 mb-10 font-mono uppercase tracking-[0.15em]"
            style={{ fontSize: '0.72rem', color: '#09203e', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#bfb170' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#09203e' }}
          >
            <ArrowLeft size={14} /> Back to Insights
          </Link>

          {/* Excerpt as lede */}
          {article.excerpt && (
            <p className="font-body leading-relaxed mb-8" style={{ fontSize: '1.2rem', color: '#09203e', fontWeight: 500, borderLeft: '4px solid #bfb170', paddingLeft: '20px' }}>
              {article.excerpt}
            </p>
          )}

          {/* Body paragraphs */}
          {article.paragraphs.map((p, i) => (
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
        </div>
      </section>

      {/* ═══ RELATED ARTICLES ═══════════════════════════════════════════════ */}
      {related.length > 0 && (
        <>
          <PixelDivider color="#09203e" layers={4} height={90} speed={0.5} />
          <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #09203e 0%, #050d1a 100%)', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
            <NetworkNodes color="#bfb170" nodeCount={20} opacity={0.1} />
            <div className="relative z-10" style={{ maxWidth: '1300px', margin: '0 auto' }}>
              <div className="text-center mb-12">
                <p className="section-label text-gold mb-4">KEEP READING</p>
                <h2 className="font-heading font-bold text-white leading-tight" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)' }}>
                  Related{' '}
                  <span style={{ color: '#bfb170' }}>Articles</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map((r) => (
                  <Link key={r.id} to={`/insights/${r.slug}`} className="block group" style={{ textDecoration: 'none' }}>
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
                        <span className="inline-flex items-center gap-1 font-body font-semibold uppercase tracking-[0.1em]" style={{ fontSize: '0.72rem', color: '#bfb170' }}>
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
