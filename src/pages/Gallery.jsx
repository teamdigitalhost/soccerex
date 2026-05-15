import { useState, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import ImageGrid from '../components/ImageGrid'
import { HOME } from '../lib/routes'

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'heritage', label: 'Heritage' },
  { key: 'legends', label: 'Legends' },
  { key: 'on-stage', label: 'On Stage' },
  { key: 'networking', label: 'Networking' },
  { key: 'europe', label: 'Europe' },
  { key: 'miami', label: 'Miami' },
  { key: 'culture', label: 'Culture & Art' },
]

export default function Gallery() {
  const [images, setImages] = useState([])
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    fetch('/gallery-manifest.json')
      .then((r) => r.json())
      .then(setImages)
  }, [])

  const filtered = activeFilter === 'all'
    ? images
    : images.filter((img) => img.categories.includes(activeFilter))

  return (
    <div className="gallery-page" style={{ background: '#050d1a', minHeight: '100vh' }}>
      {/* Hero banner */}
      <section className="gallery-hero inner-hero" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 'clamp(50px,6vw,90px) clamp(24px,5vw,80px) clamp(50px,7vw,90px)',
        background: 'linear-gradient(135deg, #050d1a 0%, #09203e 50%, #061729 100%)',
        position: 'relative',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(191,177,112,0.04) 0%, transparent 60%)' }} />
        <Link to={HOME} className="gallery-back-link" style={{
          position: 'absolute', top: 'clamp(80px,10vw,120px)', left: 'clamp(24px,5vw,80px)',
          color: 'var(--color-brand-accent)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px',
          fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase',
        }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <div className="inner-hero-crest flex justify-center" style={{ position: 'relative', zIndex: 1 }}>
          <img src="/brand/crests/crest-main-white.svg" alt="" aria-hidden="true"
            style={{ filter: 'drop-shadow(0 8px 40px rgba(255,107,53,0.3)) drop-shadow(0 0 90px rgba(255,183,3,0.15))' }} />
        </div>
        <p className="section-label text-gold mb-4" style={{ position: 'relative', zIndex: 1 }}>
          THE SOCCEREX GALLERY
        </p>
        <h1 className="font-heading font-bold text-white" style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1, position: 'relative', zIndex: 1, marginBottom: '1rem',
        }}>
          30 Years of Moments
        </h1>
        <p className="font-body text-white/60" style={{
          fontSize: 'clamp(0.95rem, 1.5vw, 1.15rem)', maxWidth: '550px', position: 'relative', zIndex: 1, lineHeight: 1.6,
        }}>
          A selection of moments from three decades of bringing the football world together.
        </p>
      </section>

      {/* Filter pills */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px',
        padding: '0 clamp(24px,5vw,80px) 2rem', maxWidth: '900px', margin: '0 auto',
      }}>
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`gallery-filter-pill ${activeFilter === f.key ? 'gallery-filter-active' : ''}`}
          >
            {f.label}
            {activeFilter === f.key && <span className="gallery-filter-count">{filtered.length}</span>}
          </button>
        ))}
      </div>

      {/* Image grid */}
      <div style={{ padding: '2rem clamp(16px,3vw,60px) 4rem', maxWidth: '1400px', margin: '0 auto' }}>
        <ImageGrid images={filtered} columns={3} showCaptions={true} />
      </div>
    </div>
  )
}
