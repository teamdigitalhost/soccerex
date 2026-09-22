import { useEffect, Fragment } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { HOME } from '../lib/routes'
import { PRESS_RELEASES } from '../data/pressReleases'
import PageMeta from '../components/PageMeta'
import { pressReleaseMeta } from '../lib/pageMeta'

/* A release names its companies' sites in running text ("neauwater.com"). Turn those into links,
   and nothing else: only a bare domain on a known suffix, never an email address. */
const SITE = /\b((?:[a-z0-9-]+\.)+(?:com|org|net|io|co))\b/gi
function withLinks(text) {
  const parts = []
  let last = 0
  for (const m of text.matchAll(SITE)) {
    if (text[m.index - 1] === '@' || text[m.index - 1] === '.') continue
    parts.push(text.slice(last, m.index))
    parts.push(
      <a key={m.index} href={`https://${m[0]}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-red)' }}>{m[0]}</a>,
    )
    last = m.index + m[0].length
  }
  if (parts.length === 0) return text
  parts.push(text.slice(last))
  return parts.map((part, i) => <Fragment key={i}>{part}</Fragment>)
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
          <Link to={HOME} className="font-body text-sm" style={{ color: 'var(--color-red)' }}>Return to homepage</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: 'linear-gradient(180deg, #f4f3f0 0%, #eae8e4 100%)', minHeight: '100vh' }}>
      <PageMeta {...pressReleaseMeta(slug, release)} />
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
          {release.subtitle && (
            <p className="font-body leading-relaxed mb-4" style={{ fontSize: '1.05rem', color: '#555' }}>{release.subtitle}</p>
          )}
          <p className="font-body text-sm" style={{ color: '#999' }}>{release.date}</p>
        </div>
      </section>

      {/* Article body */}
      <section style={{ padding: 'clamp(40px,6vw,70px) clamp(24px,5vw,80px)' }}>
        <article style={{ maxWidth: '760px', margin: '0 auto' }}>
          {release.visual && (
            <img
              src={release.visual.src} alt={release.visual.alt || ''}
              style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 10, marginBottom: 'clamp(28px,4vw,44px)' }}
            />
          )}
          {release.content.map((block, i) => {
            if (block.type === 'p') {
              return (
                <p key={i} className="font-body leading-relaxed mb-5" style={{ fontSize: '1.05rem', color: '#444' }}>
                  {block.bold && <strong style={{ color: '#1a1a1a' }}>{block.text.split('.')[0]}.</strong>}
                  {withLinks(block.bold ? block.text.split('.').slice(1).join('.') : block.text)}
                </p>
              )
            }
            if (block.type === 'quote') {
              return (
                <blockquote key={i} style={{ borderLeft: '3px solid var(--color-red)', paddingLeft: '24px', margin: '2rem 0' }}>
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
              Soccerex is the world's leading football business event platform, connecting the global football industry through conferences, exhibitions, media, and networking. For 30 years, Soccerex has brought together the most influential stakeholders in the game to shape its commercial, strategic, and institutional future.
            </p>
            {release.contacts ? (
              <div className="font-body text-sm" style={{ color: '#999' }}>
                <p className="mb-2" style={{ color: '#555', fontWeight: 600 }}>Media contacts</p>
                {release.contacts.map((c) => (
                  <p key={c.email} className="mb-1">
                    {c.org}: <a href={`mailto:${c.email}`} style={{ color: 'var(--color-red)', textDecoration: 'none' }}>{c.email}</a>
                  </p>
                ))}
              </div>
            ) : (
              <p className="font-body text-sm" style={{ color: '#999' }}>
                Media Contact: <a href="mailto:press@soccerex.com" style={{ color: 'var(--color-red)', textDecoration: 'none' }}>press@soccerex.com</a>
              </p>
            )}
          </div>
        </article>
      </section>
    </div>
  )
}
