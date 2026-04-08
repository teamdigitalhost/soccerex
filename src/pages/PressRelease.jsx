import { useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

// Press releases organized by slug. Add new ones here.
const PRESS_RELEASES = {
  'soccerex-europe-amsterdam-may-2026': {
    title: 'Soccerex Europe Returns to Amsterdam in May 2026 at the Johan Cruijff ArenA',
    date: 'January 14, 2026',
    category: 'Events',
    backLink: '/europe-2026',
    backLabel: 'Back to Event',
    content: [
      { type: 'p', bold: true, text: 'Amsterdam, Netherlands.' },
      { type: 'p', text: 'Soccerex, the world\'s leading football business platform, has today confirmed that Soccerex Europe will return to Amsterdam in May 2026, hosted once again at the iconic Johan Cruijff ArenA.' },
      { type: 'p', text: 'The 2026 edition marks the third consecutive Soccerex Europe event in Amsterdam, reinforcing the city\'s status as one of global football\'s most influential hubs for innovation, governance, and commercial leadership.' },
      { type: 'p', text: 'Following the success of previous editions, Soccerex Europe 2026 will bring together senior decision-makers from across the football ecosystem, including clubs, leagues, federations, investors, brands, and technology leaders.' },
      { type: 'p', text: 'Amsterdam\'s rich football heritage and progressive outlook continue to make it the ideal home for Soccerex Europe. The event builds on the spirit of the previous editions, which proudly carried the tagline "Total Football\'s Coming Home", celebrating the city\'s enduring influence on how the game is played, managed, and commercialised around the world.' },
      { type: 'p', text: 'Across two days, Soccerex Europe 2026 will feature a high-level conference programme, curated networking experiences, an international exhibitor showcase, and exclusive content produced for Soccerex TV. Key themes will include football governance, investment and ownership, commercial growth, infrastructure and stadia development, fan engagement, performance innovation, and the future of the global game.' },
      { type: 'p', text: 'The Johan Cruijff ArenA once again provides a fitting stage for the event, offering a world-class venue at the intersection of elite sport, technology, and business. Attendees can expect an immersive experience designed to foster meaningful connections, strategic partnerships, and informed debate around the issues shaping football\'s future.' },
      { type: 'quote', text: '"We\'re incredibly excited to be bringing Soccerex Europe back to Amsterdam for a third time. The Johan Cruijff ArenA provides an unrivalled setting to host two days of world-class content, high-level networking, and a truly international exhibition."', author: 'Garrett Navia', role: 'Managing Director of Soccerex' },
      { type: 'quote', text: '"Attendees can expect engaging discussions on the issues shaping football\'s future, innovative activations across the venue, and curated social evenings that create the environment for meaningful relationships to form. Soccerex Europe 2026 will be our most dynamic and connected Amsterdam edition yet."' },
      { type: 'p', text: 'Further announcements regarding speakers, partners, exhibitors, and ticketing will be made in the coming months. For more information and to register interest, please visit www.soccerex.com.' },
    ],
  },
}

export default function PressRelease() {
  const { slug } = useParams()
  const release = PRESS_RELEASES[slug]

  useEffect(() => { window.scrollTo(0, 0) }, [slug])

  if (!release) {
    return (
      <div style={{ background: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="text-center">
          <h1 className="font-heading font-bold text-2xl mb-4" style={{ color: '#1a1a1a' }}>Press release not found</h1>
          <Link to="/" className="font-body text-sm" style={{ color: '#c8302c' }}>Return to homepage</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: 'linear-gradient(180deg, #f4f3f0 0%, #eae8e4 100%)', minHeight: '100vh' }}>
      {/* Header */}
      <section style={{ background: '#f0eeeb', borderBottom: '1px solid #e0ddd8', padding: 'clamp(120px,12vw,160px) clamp(24px,5vw,80px) clamp(50px,6vw,70px)' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <Link to={release.backLink || '/'} className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest mb-6" style={{ color: '#999', textDecoration: 'none' }}>
            <ArrowLeft size={14} /> {release.backLabel || 'Back'}
          </Link>
          <div className="mb-4">
            <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-widest rounded-full" style={{ background: '#f0f0ee', color: '#888' }}>
              {release.category || 'Press Release'}
            </span>
          </div>
          <h1 className="font-heading font-bold leading-tight mb-4" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', color: '#1a1a1a' }}>
            {release.title}
          </h1>
          <p className="font-body text-sm" style={{ color: '#999' }}>{release.date}</p>
        </div>
      </section>

      {/* Article body */}
      <section style={{ padding: 'clamp(40px,6vw,70px) clamp(24px,5vw,80px)' }}>
        <article style={{ maxWidth: '760px', margin: '0 auto' }}>
          {release.content.map((block, i) => {
            if (block.type === 'p') {
              return (
                <p key={i} className="font-body leading-relaxed mb-5" style={{ fontSize: '1.05rem', color: '#444' }}>
                  {block.bold && <strong style={{ color: '#1a1a1a' }}>{block.text.split('.')[0]}.</strong>}
                  {block.bold ? block.text.split('.').slice(1).join('.') : block.text}
                </p>
              )
            }
            if (block.type === 'quote') {
              return (
                <blockquote key={i} style={{ borderLeft: '3px solid #c8302c', paddingLeft: '24px', margin: '2rem 0' }}>
                  <p className="font-body leading-relaxed italic mb-2" style={{ fontSize: '1.1rem', color: '#333' }}>
                    {block.text}
                  </p>
                  {block.author && (
                    <footer className="font-body text-sm" style={{ color: '#888' }}>
                      <strong style={{ color: '#555' }}>{block.author}</strong>, {block.role}
                    </footer>
                  )}
                </blockquote>
              )
            }
            return null
          })}

          {/* About */}
          <div style={{ borderTop: '1px solid #eee', paddingTop: '2rem', marginTop: '2.5rem' }}>
            <h3 className="font-heading font-bold text-lg mb-3" style={{ color: '#1a1a1a' }}>About Soccerex</h3>
            <p className="font-body leading-relaxed text-sm mb-4" style={{ color: '#666' }}>
              Soccerex is the world's leading football business event platform, connecting the global football industry through conferences, exhibitions, media, and networking. For over 25 years, Soccerex has brought together the most influential stakeholders in the game to shape its commercial, strategic, and institutional future.
            </p>
            <p className="font-body text-sm" style={{ color: '#999' }}>
              Media Contact: <a href="mailto:press@soccerex.com" style={{ color: '#c8302c', textDecoration: 'none' }}>press@soccerex.com</a>
            </p>
          </div>
        </article>
      </section>
    </div>
  )
}
