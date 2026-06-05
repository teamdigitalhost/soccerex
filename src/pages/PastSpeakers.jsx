import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { HOME } from '../lib/routes'
import { FEATURED_SPEAKERS, NAMED_SPEAKERS, FACE_WALL } from '../data/speakers'

const NAVY = '#09203e'

// Famous-first, then the rest of the named roster (already alphabetised).
const NAMED = [...FEATURED_SPEAKERS, ...NAMED_SPEAKERS]

function NamedTile({ s }) {
  return (
    <div
      style={{
        position: 'relative', borderRadius: '12px', overflow: 'hidden', aspectRatio: '3/4',
        boxShadow: '0 10px 30px rgba(9,32,62,0.1)', transition: 'transform 0.3s, box-shadow 0.3s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 50px rgba(9,32,62,0.2)' }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(9,32,62,0.1)' }}
    >
      <img src={s.img} alt={s.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 45%, rgba(9,32,62,0.95) 100%)' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 12px' }}>
        <p className="font-heading font-bold" style={{ fontSize: '0.88rem', color: '#fff', lineHeight: 1.2, marginBottom: '2px' }}>{s.name}</p>
        {s.title && <p className="font-body" style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.3 }}>{s.title}</p>}
      </div>
    </div>
  )
}

function FaceTile({ src }) {
  return (
    <div style={{ borderRadius: '10px', overflow: 'hidden', aspectRatio: '3/4', boxShadow: '0 8px 22px rgba(9,32,62,0.10)' }}>
      <img src={src} alt="Soccerex speaker" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
    </div>
  )
}

export default function PastSpeakers() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <main style={{ background: 'linear-gradient(180deg, #f4f3f0 0%, #eae8e4 100%)', minHeight: '100vh', padding: 'clamp(90px,11vw,150px) clamp(24px,5vw,80px) clamp(70px,9vw,120px)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="text-center" style={{ marginBottom: 'clamp(40px,5vw,64px)' }}>
          <p className="font-body uppercase" style={{ color: NAVY, fontWeight: 600, letterSpacing: '0.18em', fontSize: '0.72rem', marginBottom: 16 }}>THE VOICES OF THE GAME</p>
          <h1 className="font-heading font-bold leading-tight" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', color: NAVY, marginBottom: 20 }}>
            Past <span style={{ color: 'var(--color-brand-accent)' }}>Speakers</span>
          </h1>
          <div className="mx-auto" style={{ width: '80px', height: '3px', marginBottom: 20, background: 'linear-gradient(90deg, transparent, #09203e, transparent)' }} />
          <p className="font-body mx-auto" style={{ fontSize: '1.05rem', color: '#555', maxWidth: '720px', lineHeight: 1.6 }}>
            From presidents and commissioners to owners, legends, operators, and innovators, these are some of the voices that have taken the Soccerex stage across three decades and 57 events.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {NAMED.map((s, i) => <NamedTile key={`${s.name}-${i}`} s={s} />)}
        </div>

        {FACE_WALL.length > 0 && (
          <>
            <div className="text-center" style={{ margin: 'clamp(48px,6vw,80px) 0 clamp(28px,3vw,40px)' }}>
              <div className="mx-auto" style={{ width: '60px', height: '2px', marginBottom: 22, background: 'linear-gradient(90deg, transparent, #b9c2cf, transparent)' }} />
              <h2 className="font-heading font-bold" style={{ fontSize: 'clamp(1.3rem, 2.4vw, 1.9rem)', color: NAVY, marginBottom: 10 }}>
                And hundreds more across 30 years
              </h2>
              <p className="font-body mx-auto" style={{ fontSize: '0.95rem', color: '#6b7787', maxWidth: '600px', lineHeight: 1.6 }}>
                A glimpse of the faces who have shaped the conversation on Soccerex stages worldwide.
              </p>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {FACE_WALL.map((f, i) => <FaceTile key={`face-${i}`} src={f.img} />)}
            </div>
          </>
        )}

        <div className="text-center" style={{ marginTop: 'clamp(48px,6vw,72px)' }}>
          <Link to={HOME} className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.15em]" style={{ color: NAVY, fontSize: '0.82rem', textDecoration: 'none' }}>
            <ArrowLeft size={15} /> Back to home
          </Link>
        </div>
      </div>
    </main>
  )
}
