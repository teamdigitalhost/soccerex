import { useEffect, useRef, useState, useMemo } from 'react'
import Globe from 'react-globe.gl'

// ─── Event city data ────────────────────────────────────────────────────────
const CITIES = [
  { city: 'London', country: 'UK', lat: 51.5074, lng: -0.1278, years: '1996, 1997, 2005', label: 'Soccerex Launch and European Events' },
  { city: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522, years: '1998', label: 'European Expansion' },
  { city: 'Los Angeles', country: 'USA', lat: 34.0522, lng: -118.2437, years: '1999', label: 'First Americas Event' },
  { city: 'Manchester', country: 'UK', lat: 53.4808, lng: -2.2426, years: '2000, 2010-2017', label: 'European Forum and Global Convention' },
  { city: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708, years: '2001, 2006, 2008', label: 'Middle East Forum' },
  { city: 'Johannesburg', country: 'South Africa', lat: -26.2041, lng: 28.0473, years: '2007-2009', label: 'African Debut and Pre-World Cup Events' },
  { city: 'Brasilia', country: 'Brazil', lat: -15.7975, lng: -47.8919, years: '2009', label: 'South America Launch' },
  { city: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198, years: '2010', label: 'Asian Forum Launch' },
  { city: 'Rio de Janeiro', country: 'Brazil', lat: -22.9068, lng: -43.1729, years: '2010-2012', label: 'Global Convention, South America' },
  { city: 'Belem', country: 'Brazil', lat: -1.4558, lng: -48.5024, years: '2012', label: 'Brazil Roadshow' },
  { city: 'Lagos', country: 'Nigeria', lat: 6.5244, lng: 3.3792, years: '2012', label: 'West Africa Seminar' },
  { city: 'Durban', country: 'South Africa', lat: -29.8587, lng: 31.0218, years: '2012-2014', label: 'African Forum' },
  { city: 'Barbados', country: 'Barbados', lat: 13.1939, lng: -59.5432, years: '2014', label: 'Americas Forum Launch' },
  { city: 'Dead Sea', country: 'Jordan', lat: 31.5, lng: 35.5, years: '2014-2015', label: 'Asian Forum, Middle East' },
  { city: 'Mexico City', country: 'Mexico', lat: 19.4326, lng: -99.1332, years: '2016', label: 'Americas Forum' },
  { city: 'Doha', country: 'Qatar', lat: 25.2854, lng: 51.531, years: '2016', label: 'Asian Forum, Qatar' },
  { city: 'Miami', country: 'USA', lat: 25.7617, lng: -80.1918, years: '2018-2025', label: 'Soccerex Americas, Home Base', homeBase: true },
  { city: 'Zhuhai', country: 'China', lat: 22.271, lng: 113.5767, years: '2018-2019', label: 'Soccerex China' },
  { city: 'Lisbon', country: 'Portugal', lat: 38.7223, lng: -9.1393, years: '2019', label: 'European Event' },
  { city: 'Amsterdam', country: 'Netherlands', lat: 52.3676, lng: 4.9041, years: '2024-2026', label: 'Soccerex Europe' },
  { city: 'Cairo', country: 'Egypt', lat: 30.0444, lng: 31.2357, years: '2025', label: 'Soccerex MENA' },
]

// Alphabetically sorted for the directory
const CITIES_SORTED = [...CITIES].sort((a, b) => a.city.localeCompare(b.city))

// Miami hub for arcs
const MIAMI = CITIES.find((c) => c.homeBase)

// Generate arcs from Miami to every other city
const ARCS = CITIES.filter((c) => !c.homeBase).map((c) => ({
  startLat: MIAMI.lat,
  startLng: MIAMI.lng,
  endLat: c.lat,
  endLng: c.lng,
  city: c.city,
}))

export default function InteractiveGlobe() {
  const globeRef = useRef()
  const containerRef = useRef()
  const [isVisible, setIsVisible] = useState(false)
  const [globeSize, setGlobeSize] = useState(600)
  const [selectedCity, setSelectedCity] = useState(null)

  // Responsive sizing
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth
        setGlobeSize(Math.min(w, 800))
      }
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  // Fade in on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.1 }
    )
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  // Auto-rotation + start centered on Miami
  useEffect(() => {
    if (!globeRef.current || !isVisible) return
    const controls = globeRef.current.controls()
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.3
    controls.enableZoom = false

    // Center on Miami at start
    globeRef.current.pointOfView({ lat: MIAMI.lat, lng: MIAMI.lng, altitude: 2.2 }, 0)

    // Pause rotation on hover/touch, resume after
    const el = globeRef.current.renderer().domElement
    const pause = () => { controls.autoRotate = false }
    const resume = () => { setTimeout(() => { controls.autoRotate = true }, 2000) }
    el.addEventListener('pointerdown', pause)
    el.addEventListener('pointerup', resume)
    el.addEventListener('pointerleave', resume)

    return () => {
      el.removeEventListener('pointerdown', pause)
      el.removeEventListener('pointerup', resume)
      el.removeEventListener('pointerleave', resume)
    }
  }, [isVisible])

  // Fly to city when selected
  const flyToCity = (city) => {
    if (!globeRef.current) return
    setSelectedCity(city.city)
    const controls = globeRef.current.controls()
    controls.autoRotate = false
    globeRef.current.pointOfView({ lat: city.lat, lng: city.lng, altitude: 1.8 }, 1200)
    // Resume auto-rotate after a pause
    setTimeout(() => { if (controls) controls.autoRotate = true }, 5000)
  }

  // Custom tooltip HTML
  const pointLabel = useMemo(() => (d) => `
    <div style="background:rgba(11,33,61,0.95);backdrop-filter:blur(12px);border:1px solid rgba(145,123,76,0.3);border-radius:10px;padding:14px 18px;min-width:180px;font-family:Inter,sans-serif;">
      <div style="display:flex;align-items:baseline;gap:8px;margin-bottom:6px;">
        <span style="font-family:'Space Grotesk',sans-serif;font-size:16px;font-weight:700;color:#fff;">${d.city}</span>
        <span style="font-size:12px;color:rgba(255,255,255,0.5);">${d.country}</span>
      </div>
      <div style="font-family:'IBM Plex Mono',monospace;font-size:12px;letter-spacing:0.08em;color:#917B4C;margin-bottom:6px;">${d.years}</div>
      <div style="font-size:12px;color:rgba(255,255,255,0.65);line-height:1.4;">${d.label}</div>
      ${d.homeBase ? '<div style="display:inline-block;margin-top:8px;padding:3px 10px;font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#917B4C;background:rgba(145,123,76,0.15);border:1px solid rgba(145,123,76,0.3);border-radius:100px;">Home Base</div>' : ''}
    </div>
  `, [])

  return (
    <div
      ref={containerRef}
      className="globe-container"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'opacity 1s ease, transform 1s ease',
      }}
    >
      {/* Globe + City Directory side by side on desktop */}
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch', gap: '0', maxWidth: '1300px', margin: '0 auto', flexWrap: 'wrap' }}>
        {/* Globe */}
        <div className="globe-wrapper" style={{ flex: '1 1 60%', minWidth: '300px' }}>
          {isVisible && (
            <Globe
              ref={globeRef}
              width={globeSize * 0.65}
              height={globeSize * 0.65}
              backgroundColor="rgba(0,0,0,0)"
              globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
              atmosphereColor="rgba(100,140,200,0.3)"
              atmosphereAltitude={0.15}

              pointsData={CITIES}
              pointLat="lat"
              pointLng="lng"
              pointColor={(d) => d.homeBase ? '#d4a853' : (d.city === selectedCity ? '#fff' : '#917B4C')}
              pointAltitude={(d) => d.homeBase ? 0.06 : (d.city === selectedCity ? 0.05 : 0.02)}
              pointRadius={(d) => d.homeBase ? 1.2 : (d.city === selectedCity ? 1.0 : 0.7)}
              pointLabel={pointLabel}

              labelsData={CITIES}
              labelLat="lat"
              labelLng="lng"
              labelText={(d) => `${d.city} (${d.years})`}
              labelSize={(d) => d.homeBase ? 1.8 : (d.city === selectedCity ? 1.6 : 1.2)}
              labelDotRadius={0}
              labelColor={() => 'rgba(255,255,255,0.85)'}
              labelResolution={2}
              labelAltitude={(d) => d.homeBase ? 0.07 : 0.03}
              labelLabel={pointLabel}

              arcsData={ARCS}
              arcStartLat="startLat"
              arcStartLng="startLng"
              arcEndLat="endLat"
              arcEndLng="endLng"
              arcColor={() => ['rgba(145,123,76,0.5)', 'rgba(145,123,76,0.1)']}
              arcAltitudeAutoScale={0.3}
              arcStroke={0.3}
              arcDashLength={0.5}
              arcDashGap={0.3}
              arcDashAnimateTime={4000}
            />
          )}
        </div>

        {/* City Directory */}
        <div style={{
          flex: '1 1 35%', minWidth: '280px', maxWidth: '400px',
          display: 'flex', flexDirection: 'column',
          padding: 'clamp(16px, 2vw, 32px)',
        }}>
          {/* Selected city detail card */}
          {selectedCity ? (() => {
            const c = CITIES.find(x => x.city === selectedCity)
            return c ? (
              <div style={{
                background: 'rgba(191,177,112,0.08)',
                border: '1px solid rgba(191,177,112,0.25)',
                borderRadius: '12px',
                padding: '18px 16px',
                marginBottom: '16px',
                transition: 'all 0.3s',
              }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{c.city}</span>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{c.country}</span>
                </div>
                <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '0.7rem', color: '#bfb170', letterSpacing: '0.08em', marginBottom: '6px' }}>{c.years}</p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>{c.label}</p>
                {c.homeBase && (
                  <span style={{ display: 'inline-block', marginTop: '8px', padding: '3px 10px', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: '"IBM Plex Mono", monospace', color: '#bfb170', background: 'rgba(191,177,112,0.12)', border: '1px solid rgba(191,177,112,0.25)', borderRadius: '100px' }}>
                    Home Base
                  </span>
                )}
              </div>
            ) : null
          })() : (
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#bfb170', fontWeight: 600, marginBottom: '8px' }}>
                {CITIES.length} Cities Worldwide
              </p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
                Click any city to explore it on the globe.
              </p>
            </div>
          )}

          {/* Scrollable city list */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            maxHeight: '420px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(191,177,112,0.12)',
            padding: '8px',
          }}>
            {CITIES_SORTED.map((c) => {
              const isActive = selectedCity === c.city
              return (
                <button
                  key={c.city}
                  onClick={() => flyToCity(c)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                    background: isActive ? 'rgba(191,177,112,0.15)' : 'transparent',
                    borderLeft: isActive ? '3px solid #bfb170' : '3px solid transparent',
                    marginBottom: '2px',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.background = 'transparent'
                  }}
                >
                  <div>
                    <span style={{
                      fontFamily: '"Space Grotesk", sans-serif',
                      fontSize: '0.9rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#fff' : 'rgba(255,255,255,0.8)',
                      display: 'block',
                      marginBottom: '2px',
                    }}>
                      {c.city}
                      {c.homeBase && (
                        <span style={{ marginLeft: '8px', fontSize: '0.55rem', color: '#bfb170', fontFamily: '"IBM Plex Mono", monospace', textTransform: 'uppercase', letterSpacing: '0.1em', verticalAlign: 'middle' }}>
                          Home Base
                        </span>
                      )}
                    </span>
                    <span style={{
                      fontFamily: '"IBM Plex Mono", monospace',
                      fontSize: '0.65rem',
                      color: isActive ? '#bfb170' : 'rgba(255,255,255,0.35)',
                      letterSpacing: '0.05em',
                    }}>
                      {c.country} · {c.years}
                    </span>
                  </div>
                  {/* Gold dot indicator */}
                  <span style={{
                    width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0,
                    background: isActive ? '#bfb170' : 'rgba(255,255,255,0.15)',
                    boxShadow: isActive ? '0 0 8px rgba(191,177,112,0.5)' : 'none',
                    transition: 'all 0.2s',
                  }} />
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="globe-stats">
        <div className="globe-stat">
          <span className="globe-stat-number">54</span>
          <span className="globe-stat-label">Events</span>
        </div>
        <div className="globe-stat-divider" />
        <div className="globe-stat">
          <span className="globe-stat-number">23</span>
          <span className="globe-stat-label">Cities</span>
        </div>
        <div className="globe-stat-divider" />
        <div className="globe-stat">
          <span className="globe-stat-number">30</span>
          <span className="globe-stat-label">Years</span>
        </div>
      </div>

      <p className="globe-hint">Click a city from the list or hover over markers to explore. Drag to rotate.</p>

      {/* Screen reader accessible list */}
      <div className="sr-only" role="list" aria-label="Soccerex event cities">
        {CITIES.map((c) => (
          <div key={c.city} role="listitem">{c.city}, {c.country}: {c.years}. {c.label}</div>
        ))}
      </div>
    </div>
  )
}
