import { Link } from 'react-router-dom'
import { Mail, MapPin } from 'lucide-react'

// Inline brand SVGs (lucide does not ship brand icons)
const BrandIcons = {
  Facebook: (props) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.51 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99A10 10 0 0 0 22 12z" />
    </svg>
  ),
  X: (props) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  LinkedIn: (props) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.34V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.8 0 0 .78 0 1.74v20.51C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.75V1.74C24 .78 23.2 0 22.22 0z" />
    </svg>
  ),
  Instagram: (props) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  YouTube: (props) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.75 15.5v-7l6.5 3.5z" />
    </svg>
  ),
  TikTok: (props) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.66a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.09z" />
    </svg>
  ),
}

const SOCIALS = [
  { Icon: BrandIcons.Facebook, href: 'https://www.facebook.com/Soccerex/', label: 'Facebook' },
  { Icon: BrandIcons.X, href: 'https://twitter.com/Soccerex', label: 'X / Twitter' },
  { Icon: BrandIcons.LinkedIn, href: 'https://www.linkedin.com/company/soccerex/', label: 'LinkedIn' },
  { Icon: BrandIcons.Instagram, href: 'https://www.instagram.com/Soccerex/', label: 'Instagram' },
  { Icon: BrandIcons.YouTube, href: 'https://youtube.com/user/soccerextelevision', label: 'YouTube' },
  { Icon: BrandIcons.TikTok, href: 'https://www.tiktok.com/@soccerextv', label: 'TikTok' },
]

const CONTACTS = [
  { label: 'PARTNERSHIP OPPORTUNITIES', email: 'partner@soccerex.com' },
  { label: 'EXHIBIT', email: 'exhibit@soccerex.com' },
  { label: 'SPEAK', email: 'talks@soccerex.com' },
  { label: 'PRESS', email: 'press@soccerex.com' },
]

export default function Footer() {
  return (
    <footer className="relative overflow-hidden" style={{ background: '#050d1a', color: '#fff' }}>
      {/* Gold top border */}
      <div style={{ height: '3px', background: 'linear-gradient(90deg, transparent, #bfb170 20%, #bfb170 80%, transparent)' }} />

      {/* Main footer content */}
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: 'clamp(60px,8vw,100px) clamp(24px,5vw,60px) 40px' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">

          {/* Column 1: Logo + About */}
          <div>
            <Link to="/" style={{ display: 'inline-block', textDecoration: 'none', marginBottom: '24px' }}>
              <img src="/logos/soccerex---logo-landscape-white.svg" alt="Soccerex" style={{ height: '32px', width: 'auto' }} />
            </Link>
            <p className="font-body leading-relaxed" style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginBottom: '24px' }}>
              The global leader in the business of football since 1996. Connecting the industry across three continents.
            </p>
            <div className="flex items-start gap-2" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem' }}>
              <MapPin size={16} style={{ flexShrink: 0, marginTop: '2px', color: '#bfb170' }} />
              <a href="https://maps.app.goo.gl/j51i1u3YtsbJuopm8" target="_blank" rel="noopener noreferrer"
                 style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', lineHeight: 1.6, transition: 'color 0.2s' }}
                 onMouseEnter={e => { e.currentTarget.style.color = '#bfb170' }}
                 onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
              >
                Soccerex LLC<br />
                3011 Ponce de Leon Blvd, Suite #1420<br />
                Coral Gables, FL 33134
              </a>
            </div>
          </div>

          {/* Column 2: Explore */}
          <div>
            <h4 className="font-mono uppercase tracking-[0.15em] mb-6" style={{ fontSize: '0.75rem', color: '#bfb170', fontWeight: 600 }}>Explore</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                { label: 'Home', to: '/' },
                { label: 'Events', to: '/events' },
                { label: 'About', to: '/about' },
                { label: 'Global Network', to: '/global-network' },
                { label: 'Insights', to: '/insights' },
                { label: 'Europe 2026', to: '/europe-2026' },
                { label: 'Gallery', to: '/gallery' },
              ].map(l => (
                <li key={l.to} style={{ marginBottom: '12px' }}>
                  <Link to={l.to} style={{
                    color: 'rgba(255,255,255,0.6)',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontFamily: 'Inter, sans-serif',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#bfb170' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
                  >{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h4 className="font-mono uppercase tracking-[0.15em] mb-6" style={{ fontSize: '0.75rem', color: '#bfb170', fontWeight: 600 }}>Get in Touch</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {CONTACTS.map(c => (
                <li key={c.email} style={{ marginBottom: '16px' }}>
                  <p className="font-mono uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>
                    {c.label}
                  </p>
                  <a href={`mailto:${c.email}`} className="inline-flex items-center gap-2"
                     style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}
                     onMouseEnter={e => { e.currentTarget.style.color = '#bfb170' }}
                     onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.75)' }}
                  >
                    <Mail size={13} /> {c.email}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Connect/Socials */}
          <div>
            <h4 className="font-mono uppercase tracking-[0.15em] mb-6" style={{ fontSize: '0.75rem', color: '#bfb170', fontWeight: 600 }}>Connect</h4>
            <p className="font-body leading-relaxed mb-5" style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>
              Follow us for the latest from the business of football.
            </p>
            <div className="flex flex-wrap gap-3">
              {SOCIALS.map(s => {
                const Icon = s.Icon
                return (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                    style={{
                      width: '40px', height: '40px', borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(191,177,112,0.2)',
                      color: 'rgba(255,255,255,0.75)',
                      transition: 'all 0.25s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#bfb170'; e.currentTarget.style.borderColor = '#bfb170'; e.currentTarget.style.color = '#09203e' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(191,177,112,0.2)'; e.currentTarget.style.color = 'rgba(255,255,255,0.75)' }}
                  >
                    <Icon />
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(191,177,112,0.15)' }}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4" style={{ maxWidth: '1300px', margin: '0 auto', padding: '24px clamp(24px,5vw,60px)' }}>
          <p className="font-body text-center md:text-left" style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)' }}>
            © 2026 Soccerex. All Rights Reserved. Powered by{' '}
            <a href="https://digitalhost.co" target="_blank" rel="noopener noreferrer"
              style={{ color: '#bfb170', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#d4c78e' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#bfb170' }}
            >Digital Host</a>.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {[
              { label: 'Privacy Policy', to: '/privacy-policy' },
              { label: 'Terms & Conditions', to: '/terms' },
              { label: 'Cookie Policy', to: '/cookie-policy' },
              { label: 'Refund Policy', to: '/refund-policy' },
            ].map(l => (
              <Link key={l.to} to={l.to}
                style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none', fontSize: '0.78rem', transition: 'color 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#bfb170' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)' }}
              >{l.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
