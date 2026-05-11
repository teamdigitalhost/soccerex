import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Compass, Target, AlertCircle, Loader2 } from 'lucide-react'
import { getContentPillars, ApiError } from '../lib/soccerexApi'
import { isTestModeFromUrl, withTestSearch } from '../lib/testMode'

export default function ContentPillars() {
  const [pillars, setPillars] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => { window.scrollTo(0, 0) }, [])

  useEffect(() => {
    let cancelled = false
    getContentPillars({ test: isTestModeFromUrl() })
      .then((data) => { if (!cancelled) setPillars(Array.isArray(data) ? data : []) })
      .catch((err) => { if (!cancelled) setError(err) })
    return () => { cancelled = true }
  }, [])

  const featured = (pillars || []).filter((p) => p.is_featured)
  const others = (pillars || []).filter((p) => !p.is_featured)

  return (
    <div style={{ background: '#050d1a', minHeight: '100vh' }}>
      <section className="inner-hero relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at top, #0d2b52 0%, #050d1a 70%)',
        }} />
        <div className="relative z-10 text-center" style={{ maxWidth: '900px', padding: 'clamp(80px,9vw,140px) clamp(24px,5vw,80px) clamp(50px,7vw,90px)' }}>
          <p className="section-label text-gold mb-5">CONTENT STRATEGY</p>
          <h1 className="font-heading font-bold text-white leading-[1.05] mb-6" style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4.5rem)' }}>
            The Soccerex <span style={{ color: 'var(--color-gold)' }}>Pillars</span>
          </h1>
          <div className="mx-auto mb-6" style={{ width: 100, height: 3, background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)' }} />
          <p className="font-body text-white/70 leading-relaxed mx-auto" style={{ fontSize: 'clamp(1rem, 1.4vw, 1.15rem)', maxWidth: '640px' }}>
            How we frame the football business: each pillar pairs a strategic message with the audience it serves, the goal it advances, and the owned content that proves it.
          </p>
        </div>
      </section>

      <section style={{ background: 'linear-gradient(180deg, #f4f3f0 0%, #eae8e4 100%)', padding: 'clamp(60px,8vw,100px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {error && <ErrorBanner error={error} />}
          {!error && pillars === null && <Loading />}
          {!error && pillars && pillars.length === 0 && (
            <p className="font-body text-center py-20" style={{ color: '#555' }}>
              No active pillars yet. Check back soon.
            </p>
          )}

          {featured.length > 0 && (
            <>
              <SectionHeading kicker="Featured" title="The headline narrative" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                {featured.map((p) => <PillarCard key={p.slug} pillar={p} large />)}
              </div>
            </>
          )}

          {others.length > 0 && (
            <>
              <SectionHeading kicker="Pillars" title="The wider story" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {others.map((p) => <PillarCard key={p.slug} pillar={p} />)}
              </div>
            </>
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

function PillarCard({ pillar, large }) {
  const hasAnchor = !!pillar.anchor_article
  return (
    <Link to={withTestSearch(`/pillars/${pillar.slug}`)} className="group block" style={{
      background: '#FFFFFF',
      border: '1px solid rgba(9,32,62,0.08)',
      padding: large ? 32 : 24,
      textDecoration: 'none',
      transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
      display: 'flex', flexDirection: 'column', gap: 14,
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(191,177,112,0.5)'
        e.currentTarget.style.boxShadow = '0 18px 40px -24px rgba(9,32,62,0.25)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(9,32,62,0.08)'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'translateY(0)'
      }}>
      <div className="flex items-center gap-2">
        <span className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--color-gold)' }}>
          {pillar.audience || 'Pillar'}
        </span>
        {pillar.is_featured && (
          <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: '0.18em', color: '#09203e', background: 'rgba(191,177,112,0.18)', padding: '3px 8px' }}>
            Featured
          </span>
        )}
      </div>
      <h3 className="font-heading font-bold leading-tight" style={{ fontSize: large ? 'clamp(1.4rem, 2.6vw, 1.9rem)' : '1.2rem', color: '#09203e' }}>
        {pillar.name}
      </h3>
      {pillar.summary && (
        <p className="font-body leading-relaxed" style={{ fontSize: large ? '1rem' : '0.92rem', color: '#3a4a5a' }}>
          {pillar.summary}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1">
        {pillar.business_goal && <MetaChip icon={Target} label="Goal" value={pillar.business_goal} />}
        {pillar.conversion_goal && <MetaChip icon={Compass} label="Convert" value={pillar.conversion_goal} />}
      </div>
      {Array.isArray(pillar.channels) && pillar.channels.length > 0 && (
        <p className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.15em', color: '#607186' }}>
          {pillar.channels.join(' · ')}
        </p>
      )}
      <div className="flex items-center gap-2 mt-2" style={{ color: 'var(--color-gold)' }}>
        <span className="font-body font-semibold uppercase tracking-[0.15em]" style={{ fontSize: '0.78rem' }}>
          {hasAnchor ? 'Read the anchor' : 'Explore strategy'}
        </span>
        <ArrowRight size={14} />
      </div>
    </Link>
  )
}

function MetaChip({ icon: Icon, label, value }) {
  return (
    <span className="inline-flex items-center gap-2" style={{ fontSize: '0.78rem', color: '#3a4a5a' }}>
      <Icon size={13} style={{ color: '#607186' }} />
      <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: '0.18em', color: '#607186' }}>{label}</span>
      <span className="font-body" style={{ color: '#09203e' }}>{value}</span>
    </span>
  )
}

function Loading() {
  return (
    <div className="flex items-center justify-center gap-3 py-20" style={{ color: '#607186' }}>
      <Loader2 size={20} className="prog-spin" />
      <span className="font-mono uppercase" style={{ fontSize: 12, letterSpacing: '0.2em' }}>Loading pillars</span>
    </div>
  )
}

function ErrorBanner({ error }) {
  const msg = error instanceof ApiError ? error.message : (error?.message || 'Could not reach the marketing CMS.')
  return (
    <div className="flex items-start gap-3 p-5" style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.25)' }}>
      <AlertCircle size={20} style={{ color: '#b91c1c', flexShrink: 0 }} />
      <p className="font-body" style={{ fontSize: 13, color: '#7c1d1d' }}>{msg}</p>
    </div>
  )
}
