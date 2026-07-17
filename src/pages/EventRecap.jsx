import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, MapPin, Images, Calendar } from 'lucide-react'
import NetworkNodes from '../animations/NetworkNodes'
import PixelDivider from '../components/PixelDivider'
import { useScrollAnimations } from '../lib/useScrollAnimations'
import { EVENTS, GALLERY, MIAMI_2026 } from '../lib/routes'
import { RECENT } from './Events'

// Recap page for a past Soccerex event. Data comes from the same RECENT array the
// Events page uses, so the write-up, dates, and hero image live in one place.
export default function EventRecap() {
  const { eventSlug } = useParams()
  const event = RECENT.find((e) => e.slug === eventSlug)

  useScrollAnimations()
  useEffect(() => { window.scrollTo(0, 0) }, [eventSlug])

  // Unknown slug: send them to the events listing rather than a blank page.
  if (!event) return <Navigate to={EVENTS} replace />

  const copyArray = Array.isArray(event.copy) ? event.copy : [event.copy]

  return (
    <div style={{ background: '#050d1a' }}>
      {/* ═══ HERO ═══════════════════════════════════════════════════════════ */}
      <section className="inner-hero relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0" style={{
          backgroundImage: `url(${event.image})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'saturate(0.7) brightness(0.4)',
        }} />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, rgba(5,13,26,0.55) 0%, rgba(9,32,62,0.7) 45%, rgba(5,13,26,0.96) 100%)',
        }} />
        <NetworkNodes color="#ffffff" accentColor="var(--color-brand-accent)" nodeCount={40} opacity={0.16} />

        <div className="relative z-10 text-center" style={{ maxWidth: '1000px', padding: 'clamp(60px,7vw,110px) clamp(24px,5vw,80px) clamp(60px,8vw,100px)' }}>
          <Link to={EVENTS} className="inline-flex items-center gap-2 font-mono uppercase tracking-[0.15em] fade-up"
            style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.72rem', textDecoration: 'none', marginBottom: '28px' }}>
            <ArrowLeft size={14} /> All Events
          </Link>

          {event.logo && (
            <div className="flex justify-center mb-8 fade-up">
              <div style={{ background: 'rgba(255,255,255,0.95)', padding: '12px 20px', borderRadius: '10px', backdropFilter: 'blur(8px)', boxShadow: '0 6px 24px rgba(0,0,0,0.25)' }}>
                <img src={event.logo} alt="" style={{ height: '38px', width: 'auto', display: 'block' }} />
              </div>
            </div>
          )}

          <p className="section-label mb-5 fade-up" style={{ color: 'var(--color-brand-accent)', fontWeight: 600 }}>{event.label}</p>
          <h1 className="font-heading font-bold text-white leading-[1.05] mb-6 fade-up text-glow" style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4.4rem)' }}>
            {event.dates}
          </h1>
          <div className="flex items-center justify-center gap-2 fade-up" style={{ color: 'rgba(255,255,255,0.7)' }}>
            <MapPin size={16} style={{ color: 'var(--color-brand-accent)' }} />
            <span className="font-body" style={{ fontSize: '1rem' }}>{event.city}</span>
          </div>
        </div>
      </section>

      <PixelDivider color="#050d1a" layers={4} height={90} speed={0.5} />

      {/* ═══ WRITE-UP ═══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #f4f3f0 0%, #eae8e4 100%)', padding: 'clamp(80px,10vw,140px) clamp(24px,5vw,80px)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(9,32,62,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(9,32,62,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div className="relative z-10" style={{ maxWidth: '860px', margin: '0 auto' }}>
          <p className="section-label mb-4 fade-up" style={{ color: '#09203e', fontWeight: 600 }}>EVENT RECAP</p>
          <div className="fade-up mb-8" style={{ width: '60px', height: '3px', background: 'linear-gradient(90deg, #09203e, rgba(9,32,62,0.3))' }} />
          {copyArray.map((p, i) => (
            <p key={i} className="font-body leading-relaxed mb-5 fade-up" style={{ fontSize: '1.08rem', color: '#333' }}>
              {p}
            </p>
          ))}

          <div className="flex flex-wrap items-center gap-4 mt-10 fade-up">
            <Link to={event.region && event.region !== 'all' ? `${GALLERY}?filter=${event.region}` : GALLERY} className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.15em]"
              style={{ background: '#09203e', color: '#fff', padding: '16px 34px', fontSize: '0.8rem', textDecoration: 'none' }}>
              <Images size={16} /> View Photos
            </Link>
            <Link to={EVENTS} className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.15em]"
              style={{ background: 'transparent', color: '#09203e', padding: '16px 34px', fontSize: '0.8rem', textDecoration: 'none', border: '1px solid #09203e' }}>
              All Events <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <PixelDivider color="#eae8e4" layers={4} height={90} speed={0.5} />

      {/* ═══ NEXT EVENT CTA ═════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a0000 0%, #3a0a0a 50%, #1a0000 100%)', padding: 'clamp(80px,10vw,130px) clamp(24px,5vw,80px)' }}>
        <NetworkNodes color="#ffffff" accentColor="var(--color-red)" nodeCount={30} opacity={0.12} />
        <div className="relative z-10 text-center" style={{ maxWidth: '820px', margin: '0 auto' }}>
          <Calendar size={38} color="var(--color-red)" strokeWidth={2} className="mx-auto mb-6 fade-up" />
          <p className="section-label mb-4 fade-up" style={{ color: 'var(--color-red)' }}>WHAT'S NEXT</p>
          <h2 className="font-heading font-bold text-white leading-tight mb-6 fade-up text-glow" style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3.2rem)' }}>
            Join us at Soccerex Miami 2026
          </h2>
          <p className="font-body text-white/75 leading-relaxed fade-up mb-9 mx-auto" style={{ fontSize: '1.05rem', maxWidth: '640px' }}>
            September 23 to 25, 2026 at Nu Stadium, Miami Freedom Park. The Americas event of the Soccerex platform.
          </p>
          <Link to={MIAMI_2026} className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.15em] fade-up"
            style={{ background: '#c8302c', color: '#fff', padding: '18px 40px', fontSize: '0.85rem', textDecoration: 'none' }}>
            Event Details <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}
