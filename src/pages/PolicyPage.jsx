import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import NetworkNodes from '../animations/NetworkNodes'
import PixelDivider from '../components/PixelDivider'

export default function PolicyPage({ title, eyebrow, lastUpdated, sections }) {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div style={{ background: '#f4f3f0' }}>
      {/* Hero */}
      <section className="relative overflow-hidden flex items-center justify-center" style={{ minHeight: '45vh', background: 'linear-gradient(135deg, #09203e 0%, #0d2b52 50%, #050d1a 100%)' }}>
        <NetworkNodes color="#bfb170" nodeCount={30} opacity={0.12} />
        <div className="absolute pointer-events-none" style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '800px', height: '800px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(191,177,112,0.1) 0%, transparent 60%)' }} />
        <div className="relative z-10 text-center" style={{ maxWidth: '900px', padding: 'clamp(140px,15vw,180px) clamp(24px,5vw,60px) clamp(60px,8vw,100px)' }}>
          {eyebrow && <p className="section-label text-gold mb-4" style={{ opacity: 0.9 }}>{eyebrow}</p>}
          <h1 className="font-heading font-bold text-white leading-tight mb-6 text-glow" style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}>
            {title}
          </h1>
          <div className="mx-auto mb-6" style={{ width: '80px', height: '3px', background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)' }} />
          {lastUpdated && (
            <p className="font-mono uppercase tracking-widest" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)' }}>
              Last updated: {lastUpdated}
            </p>
          )}
        </div>
      </section>

      <PixelDivider color="#f4f3f0" layers={4} height={90} speed={0.5} />

      {/* Content */}
      <section style={{ background: '#f4f3f0', padding: 'clamp(60px,8vw,120px) clamp(24px,5vw,80px) clamp(80px,10vw,140px)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Link to="/" className="inline-flex items-center gap-2 mb-10 font-mono uppercase tracking-[0.15em]"
            style={{ fontSize: '0.72rem', color: '#09203e', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#bfb170' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#09203e' }}
          >
            <ArrowLeft size={14} /> Back to home
          </Link>

          {sections.map((s, i) => (
            <div key={i} style={{ marginBottom: '40px' }}>
              {s.heading && (
                <h2 className="font-heading font-bold mb-4" style={{ fontSize: 'clamp(1.2rem, 2vw, 1.5rem)', color: '#09203e' }}>
                  {s.heading}
                </h2>
              )}
              {s.paragraphs.map((p, j) => (
                <p key={j} className="font-body leading-relaxed mb-4" style={{ fontSize: '1rem', color: '#444' }}>
                  {p}
                </p>
              ))}
              {s.list && (
                <ul style={{ paddingLeft: '24px', marginBottom: '16px' }}>
                  {s.list.map((li, k) => (
                    <li key={k} className="font-body leading-relaxed" style={{ fontSize: '1rem', color: '#444', marginBottom: '8px' }}>{li}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
