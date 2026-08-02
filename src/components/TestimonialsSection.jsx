import { useState, useEffect } from 'react'

const TESTIMONIALS = [
  { quote: 'Soccerex is legendary. It is a collection of incredible minds and people from the industry.', author: 'Alexi Lalas', role: 'Fox Sports, Former USMNT', img: '/images/testimonials/alexi-lalas.webp' },
  { quote: 'Soccerex is a great event, I am very happy to be here again.', author: 'Gianni Infantino', role: 'FIFA President', img: '/images/testimonials/gianni-infantino.webp' },
  { quote: "Soccerex brings football together; generally people meeting each other, businesses with organisations, associations, with clubs; it's important, football is absolutely huge, the power of football to pull people together around the world and to connect with people is enormous.", author: 'Gary Neville', role: 'Sky Sports, Former England International', img: '/images/testimonials/gary-neville.webp' },
  { quote: "Soccerex is not just a good idea it is necessary, it's part of the football calendar.", author: 'Guillem Ballague', role: 'Football Journalist, Author', img: '/images/testimonials/guillem-ballague.webp' },
  { quote: 'Soccerex to me is about exchange, an exchange of ideas, an exchange of opportunities.', author: 'Jason Roberts MBE', role: 'CONCACAF Director of Development', img: '/images/testimonials/jason-roberts.webp' },
  { quote: 'For LaLiga, being at Soccerex, it is not only important, it is essential.', author: 'Javier Tebas', role: 'LaLiga President', img: '/images/testimonials/javier-tebas.webp' },
  { quote: "To come here and meet the people and learn the things that I've learnt in the sessions, in networking moments, and even in the cafe, it's absolutely blown me away.", author: 'Amanda Vandervort', role: 'USL Super League President', img: '/images/testimonials/amanda-vandervort.webp' },
  { quote: "Any time I get to be surrounded by people who have the same passion for the game that I do, the conversations that teach you and help you grow and learn, that's why I love it.", author: 'Karina LeBlanc', role: 'Portland Thorns GM', img: '/images/testimonials/karina-la-blanc.webp' },
]

export default function TestimonialsSection({ background = '#fff', padding }) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActive(prev => (prev + 1) % TESTIMONIALS.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const t = TESTIMONIALS[active]

  return (
    <section style={{ background, padding: padding ?? 'clamp(80px,10vw,120px) clamp(24px,5vw,80px)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="flex items-start gap-4 mb-12 fade-up">
          <div style={{ width: '6px', height: 'clamp(50px, 8vw, 80px)', background: 'var(--color-brand-accent)', borderRadius: '3px', flexShrink: 0, marginTop: '4px' }} />
          <h2 className="font-heading font-bold uppercase leading-none" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: '#09203e', letterSpacing: '0.02em' }}>
            Testimonials
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 fade-up" style={{ borderRadius: '16px', overflow: 'hidden', minHeight: '400px', border: '2px solid var(--color-brand-accent)', boxShadow: '0 18px 48px -28px rgba(233,30,99,0.45)' }}>
          <div className="md:col-span-5 relative" style={{ minHeight: '300px' }}>
            {TESTIMONIALS.map((item, i) => {
              const next = (active + 1) % TESTIMONIALS.length
              if (i !== active && i !== next) return null
              return (
                <img
                  key={item.author}
                  src={item.img}
                  alt={item.author}
                  loading="lazy"
                  style={{
                    position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
                    opacity: i === active ? 1 : 0,
                    transition: 'opacity 0.8s ease',
                  }}
                />
              )
            })}
          </div>

          <div className="md:col-span-7 relative" style={{ background: '#FFFFFF', padding: 'clamp(40px, 6vw, 72px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span className="font-heading font-bold absolute pointer-events-none" style={{ top: '10px', left: '16px', fontSize: 'clamp(4rem, 6vw, 6rem)', color: 'var(--color-brand-accent)', opacity: 0.18, lineHeight: 1 }}>"</span>
            <span className="font-heading font-bold absolute pointer-events-none" style={{ bottom: '10px', right: '16px', fontSize: 'clamp(4rem, 6vw, 6rem)', color: 'var(--color-brand-accent)', opacity: 0.18, lineHeight: 1 }}>"</span>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <p className="font-body leading-relaxed mb-8" style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.15rem)', color: '#1a1a1a' }}>
                {t.quote}
              </p>
              <p className="font-heading font-bold uppercase" style={{ fontSize: 'clamp(1rem, 1.8vw, 1.3rem)', color: '#09203e', letterSpacing: '0.02em' }}>
                {t.author}
              </p>
              <p className="font-body uppercase tracking-[0.1em]" style={{ fontSize: '0.8rem', color: 'rgba(9,32,62,0.6)', marginTop: '4px' }}>
                {t.role}
              </p>
            </div>

            <div className="flex gap-2 mt-8">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className="border-none cursor-pointer transition-all duration-300"
                  style={{
                    width: i === active ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    background: i === active ? '#09203e' : 'rgba(9,32,62,0.25)',
                  }}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
