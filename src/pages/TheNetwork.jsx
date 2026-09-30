import { useState } from 'react'
import { ArrowRight, Check, Mail, Mic } from 'lucide-react'
import PageMeta from '../components/PageMeta'
import { pageMeta } from '../lib/pageMeta'
import { CONTACT, THE_NETWORK } from '../lib/routes'
import { submitLead } from '../lib/soccerexApi'
import { isTestModeFromUrl } from '../lib/testMode'

/* ═══ The Network: a Soccerex original, hosted by Diego Arrioja ═══════════
 * Built to the positioning spec (The_Network_Website_Positioning_Recommendation):
 * the page leads with the promise, introduces Diego straight after the hero,
 * makes the case for Soccerex, shows guests as proof and then asks brands to
 * become founding partners. Guests and viewers get quieter secondary paths.
 *
 * The page is unlisted (see THE_NETWORK in routes.js) until the team signs it
 * off. Partner assets are written as program components subject to each
 * signed scope. Keep prices and a count of places off this page.
 *
 * When an episode publishes, give it `watchUrl` and its card switches from
 * "Coming soon" to a Watch link.
 */

const NAVY = '#09203e'
const NAVY_DEEP = '#050d1a'
const PINK = 'var(--color-brand-accent)'
const INK = 'rgba(255,255,255,0.78)'
const BODY_DARK = '#3a4a5a'
const IMG = '/images/the-network'
const SHOW_EMAIL = 'thenetwork@soccerex.com'
const PARTNER_URL = `${CONTACT}?type=partner&from=the-network`
const GUEST_MAILTO = `mailto:${SHOW_EMAIL}?subject=${encodeURIComponent('The Network: guest inquiry')}`

/* GA4 events. gtag only exists once the visitor has accepted analytics
   cookies, so this is a no-op otherwise. */
function track(name, params = {}) {
  try { window.gtag?.('event', name, { page: 'the-network', ...params }) } catch { /* analytics must never break the page */ }
}

const GUESTS = [
  { n: 1, guest: 'Jack Dempsey', role: 'Strategic Partnerships and Development Manager, Laurel Springs School', preview: true,
    hook: 'His students compete internationally before they can drive. Diego and Jack discuss how young athletes can pursue elite competition while staying on track academically.' },
  { n: 2, guest: 'Jim McCarthy', role: 'Founder, Impresario Strategic Growth Services', preview: true,
    hook: 'Jim sees clubs leaving seats empty. His answer includes a family zone called Gnarlyville and new ways to make matchday worth sharing.' },
  { n: 3, guest: 'Michael Donald', role: 'Photographer and filmmaker, GOAL!',
    hook: 'Michael tracked down every living man who scored in a World Cup final. Along the way, he found the human side of football history.' },
  { n: 4, guest: 'Anna Pereira', role: 'Founder and CEO, The Wellness Universe', preview: true,
    hook: 'The women’s game is growing faster than the support around its players. Anna is building what is missing.' },
  { n: 5, guest: 'Alex Bowden', role: 'Founder and CEO, Career Catalyst',
    hook: 'After dancing professionally in New York and moving into HR, Alex now helps players make a plan for life after football.' },
  { n: 6, guest: 'Danielle Duboc', role: 'Executive Director, Fútbol con Corazón',
    hook: 'Sixty percent of Danielle’s coaches started as children on her own fields. She explains how a free after-school program helps young people move from trauma to triumph.' },
  { n: 7, guest: 'Ryan Bailey', role: 'Chief Operating Officer, Americas, Red Knot',
    hook: 'American kids can name players at Borussia Dortmund. Ryan knows where that connection came from and what clubs can do with it.' },
  { n: 8, guest: 'Lili Cantero', role: 'Artist', preview: true,
    hook: 'She was told she could never make a living from art. Lionel Messi ended up holding the boots she painted for him.' },
].map((g) => ({ ...g, img: `${IMG}/guest-0${g.n}.jpg` }))

const PROOF = [
  { label: 'Since 1996', body: 'Soccerex has brought the football business community together for three decades.' },
  { label: 'Global network', body: 'Clubs, leagues, federations, brands, investors and innovators.' },
  { label: 'Hosted by Diego Arrioja', body: 'An Emmy-winning journalist who knows the Soccerex stage.' },
]

const PARTNER_TYPES = [
  { name: 'Presenting partner', body: 'Put your brand at the heart of the series.' },
  { name: 'Segment partner', body: 'Own one of four recurring features:',
    list: [
      ['The Scouting Report', 'what the guest sees coming. Suited to data, analytics and AI.'],
      ['The Kit Bag', 'a product or technology show-and-tell.'],
      ['My Soccerex Story', 'what the industry gave a leader. Suited to services, advisory and agencies.'],
      ['Final Whistle', 'the guest’s prediction for football business in 2030.'],
    ] },
  { name: 'La Red, the Spanish-language edition', body: 'Diego interviews the same guests again in Spanish for Latin American and U.S. Hispanic football-business audiences, with a Spanish-language clip pack for regional channels.' },
  { name: 'Episode partner', body: 'Support a conversation and connect with its subject and its audience.' },
  { name: 'Live Soccerex edition', body: 'Bring Diego and The Network into a Soccerex gathering for a filmed conversation or roundtable, then carry the moment into a published episode and clips.' },
]

const SIGNATURE_ASSETS = [
  { name: 'The Founder’s Chair', body: 'Once during the season, a senior leader from a founding partner takes the guest seat and is interviewed in the same format as every other guest. The interview is editorial, and Soccerex keeps the questions and the final cut.' },
  { name: 'The Boardroom Report', body: 'The season’s closing questions on the future of football business become a published industry report, presented by the founding presenting partner.' },
  { name: 'The clip vault', body: 'First access to approved clips, quotes and stills from every episode for partner marketing, sales decks and owned channels, under an agreed footage license.' },
  { name: 'Soccerex introductions', body: 'Where it fits, and with everyone’s consent, Soccerex can introduce partners to guests and to members of its football business community.' },
  { name: 'Founding partner recognition', body: 'A permanent founding credit on the series page and archive, plus agreed opening and closing credits on the contracted pieces.' },
  { name: 'Category exclusivity', body: 'One founding partner per agreed business category.' },
  { name: 'Rate protection', body: 'Agreed partner rates held across future seasons.' },
  { name: 'First refusal', body: 'First refusal on future seasons and formats, including live editions and market-specific spin-offs.' },
  { name: 'Founding partner wall', body: 'A named acknowledgment of the launch partners on this page.' },
]

const DELIVERABLES = [
  { name: 'Episode and segment credits', body: 'Segment partners receive a partner card, a host mention and a lower-third across the season, plus a permanent archive credit. Episode partners receive an opening billboard, a host read, a closing credit, the episode page and a clip package.' },
  { name: 'Season distribution', body: 'Full episodes, vertical clips for LinkedIn, Reels, Shorts and TikTok, permanent episode pages on Soccerex.com, email and social promotion, and an asset pack for every guest to share.' },
  { name: 'Performance reporting', body: 'A season report on reach, engagement and traffic, with a tracked link for each episode.' },
  { name: 'Season-shortfall protection', body: 'If the season runs shorter than agreed, founding partner terms extend into the next season at no cost.' },
]

const SEGMENTS = [
  { name: 'Kickoff', body: 'Where it began, often a long way from football.' },
  { name: 'Starting XI', body: 'Who they picked, and who picked them.' },
  { name: 'The Assist', body: 'The work, up close.' },
  { name: 'The Goal', body: 'The moment it paid off.' },
  { name: 'My Soccerex Story', body: 'What happened after the introduction.' },
  { name: 'Final Whistle', body: 'The line they leave you with.' },
]

/* 2026 Soccerex audience data, from the guest invitation and partner deck. */
const AUDIENCE = [
  { figure: '20,273', label: 'People at director level or above' },
  { figure: '8,012', label: 'Chief executives, founders, presidents and owners' },
  { figure: '6,517', label: 'Commercial, partnership and revenue leaders' },
  { figure: '2,604', label: 'Clubs' },
  { figure: '1,542', label: 'Federations, leagues and governing bodies' },
  { figure: '22,213', label: 'Companies serving football' },
]

const WRAP = { maxWidth: 1240, margin: '0 auto' }
const PAD = 'clamp(64px,8vw,112px) clamp(20px,5vw,64px)'
const LEAD = { fontSize: 'clamp(1.05rem, 1.35vw, 1.18rem)', lineHeight: 1.7 }

export default function TheNetwork() {
  return (
    <div style={{ background: NAVY_DEEP, color: '#fff' }}>
      <PageMeta {...pageMeta(THE_NETWORK)} />

      {/* ═══ 01 HERO ═════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ paddingTop: 72 }}>
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 78% 30%, #173c6e 0%, ${NAVY_DEEP} 62%)` }} />
        <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_1.08fr] items-center gap-10 lg:gap-14"
          style={{ ...WRAP, padding: 'clamp(40px,6vw,96px) clamp(20px,5vw,64px) clamp(56px,7vw,104px)' }}>
          <div>
            <h1 className="font-heading font-bold" style={{ fontSize: 'clamp(2.6rem, 5.6vw, 4.6rem)', lineHeight: 1.02, letterSpacing: '-0.02em' }}>
              Football’s future is being shaped off the pitch.
            </h1>
            <p style={{ ...LEAD, color: '#fff', marginTop: 22, maxWidth: 560 }}>
              The Network brings you into the conversations, ideas and decisions moving the game forward, through the people making them.
            </p>
            <p style={{ fontSize: '1rem', lineHeight: 1.65, color: INK, marginTop: 14, maxWidth: 560 }}>
              A Soccerex original, hosted by Emmy-winning journalist Diego Arrioja and built on 30 years of Soccerex relationships across the global game.
            </p>
            <div className="flex flex-col items-stretch sm:items-start gap-3" style={{ marginTop: 32 }}>
              <PartnerButton location="hero" />
              <a href="#network-guests-preview" onClick={() => track('network_guest_preview_click')}
                className="inline-flex items-center justify-center gap-2 font-semibold" style={{ color: '#fff', fontSize: '1rem', padding: '10px 4px' }}>
                Meet the people moving football forward <ArrowRight size={17} />
              </a>
            </div>
          </div>

          <figure className="relative" style={{ margin: 0 }}>
            <div style={{ position: 'absolute', inset: '-8% -6%', background: 'radial-gradient(circle, rgba(233,30,99,0.22) 0%, transparent 60%)', pointerEvents: 'none' }} />
            <img src={`${IMG}/hero-conversation.jpg`} width="1344" height="756"
              alt="Diego Arrioja interviewing DJ Khaled on the Soccerex Miami 2026 stage"
              style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', objectFit: 'cover', borderRadius: 18, boxShadow: '0 30px 80px rgba(0,0,0,0.5)', display: 'block' }} />
            <figcaption style={{ position: 'absolute', left: 16, bottom: 16, background: 'rgba(5,13,26,0.82)', padding: '8px 14px', borderRadius: 8, fontSize: '0.92rem', fontWeight: 600 }}>
              Diego Arrioja, host of The Network
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ═══ 02 MEET DIEGO ═══════════════════════════════════════════════ */}
      <section style={{ background: '#f4f3f0', color: NAVY, padding: PAD }}>
        <div className="grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-16 items-center" style={{ maxWidth: 1120, margin: '0 auto' }}>
          <img src={`${IMG}/diego-stage.jpg`} width="500" height="625" loading="lazy"
            alt="Diego Arrioja hosting a session on the Soccerex Miami 2026 main stage"
            style={{ width: '100%', maxWidth: 400, aspectRatio: '4 / 5', objectFit: 'cover', borderRadius: 16, margin: '0 auto', boxShadow: '0 24px 60px rgba(9,32,62,0.22)' }} />
          <div>
            <h2 className="font-heading font-bold" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.08, color: NAVY }}>Meet Diego Arrioja</h2>
            <p style={{ ...LEAD, color: BODY_DARK, marginTop: 18 }}>
              Diego Arrioja is an Emmy-winning journalist at NBCUniversal Telemundo Enterprises. He co-hosts the daily show El Pelotazo, reports from the Sunday Night Football sideline and has covered three FIFA World Cups, the Super Bowl and the UEFA European Championship.
            </p>
            <p style={{ ...LEAD, color: BODY_DARK, marginTop: 14 }}>
              The Soccerex community knows Diego from the main stage in Miami and Amsterdam. At Soccerex Miami 2026 he hosted the sessions on football investment strategy and the FIFA World Cup 26, and the Roc Nation Sports International session that DJ Khaled joined. He interviews in English and Spanish, so the series can speak directly to North American and Latin American audiences. On The Network, he brings the same live-event confidence and a journalist’s curiosity to close conversations with the people moving football forward.
            </p>
            <ul className="flex flex-wrap" style={{ listStyle: 'none', padding: 0, margin: '22px 0 0', gap: 8 }}>
              {['Emmy-winning journalist', 'NBCUniversal Telemundo', 'El Pelotazo co-host', 'Sunday Night Football sideline reporter'].map((c) => (
                <li key={c} style={{ background: '#fff', border: '1px solid rgba(9,32,62,0.12)', borderRadius: 999, padding: '7px 14px', fontSize: '0.9rem', fontWeight: 600 }}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ═══ 03 PROOF STRIP ══════════════════════════════════════════════ */}
      <section style={{ background: NAVY, padding: 'clamp(36px,4vw,56px) clamp(20px,5vw,64px)' }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={WRAP}>
          {PROOF.map((p) => (
            <div key={p.label} style={{ borderLeft: `3px solid ${PINK}`, padding: '6px 0 6px 18px' }}>
              <h3 className="font-heading" style={{ fontSize: '1.25rem', fontWeight: 700 }}>{p.label}</h3>
              <p style={{ color: INK, lineHeight: 1.55, marginTop: 6, fontSize: '1rem' }}>{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 04 WHY THE NETWORK + 05 WHY SOCCEREX ════════════════════════ */}
      <section style={{ padding: PAD }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20" style={WRAP}>
          <div>
            <SectionHeading>Football moves on the pitch. The business moves through people.</SectionHeading>
            <p style={{ ...LEAD, color: INK, marginTop: 18 }}>
              Football is one of the world’s great shared passions, and its future is shaped in boardrooms, at training grounds, across communities and through the relationships that turn an idea into action. The Network gives those stories a place to be heard. It is a platform for the leaders, investors and creators whose decisions shape where football goes next, and for the ideas the industry needs to hear.
            </p>
          </div>
          <div>
            <SectionHeading>Thirty years of bringing football together. Now the conversations travel further.</SectionHeading>
            <p style={{ ...LEAD, color: INK, marginTop: 18 }}>
              For three decades, Soccerex has brought together the clubs, federations, brands and investors shaping football around the world. That history gives The Network its starting point: a community built through real relationships across the game. Those relationships now open a new kind of access, taking the industry’s most important conversations to audiences well beyond the event floor. The Network extends what Soccerex has always done, bringing the right people together and helping turn connection into opportunity.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ 06 THE PLATFORM ═════════════════════════════════════════════ */}
      <section style={{ background: NAVY, padding: PAD }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <SectionHeading center>A new Soccerex platform that runs all year</SectionHeading>
          <p style={{ ...LEAD, color: INK, marginTop: 18 }}>
            The Network carries the conversation through the year, between events as well as when the industry gathers in person. Each conversation can become a full episode, short-form clips and a permanent page on Soccerex.com, and a new point of connection between guests, partners and the Soccerex community. Live editions bring the same energy into Soccerex events, and the season builds original insight into how decision-makers see football’s future.
          </p>
        </div>
      </section>

      {/* ═══ 07 GUEST PREVIEW ════════════════════════════════════════════ */}
      <section id="network-guests-preview" style={{ padding: PAD, scrollMarginTop: 72 }}>
        <div style={WRAP}>
          <SectionHeading>The people behind football’s next move</SectionHeading>
          <p style={{ ...LEAD, color: INK, maxWidth: 760, marginTop: 14 }}>
            Every guest sees a different part of the game. Together, their stories reveal the decisions, ambition and ideas shaping what comes next.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" style={{ marginTop: 36 }}>
            {GUESTS.filter((g) => g.preview).map((g) => <GuestCard key={g.n} g={g} />)}
          </div>
          <a href="#network-guests" className="inline-flex items-center gap-2 font-semibold" style={{ color: '#fff', marginTop: 26, fontSize: '1rem' }}>
            Meet all the guests <ArrowRight size={17} />
          </a>
        </div>
      </section>

      {/* ═══ 08 FOUNDING PARTNERS ════════════════════════════════════════ */}
      <section id="founding-partners" style={{ background: '#f4f3f0', color: NAVY, padding: PAD, scrollMarginTop: 72 }}>
        <div style={WRAP}>
          <div style={{ maxWidth: 820 }}>
            <SectionHeading dark>Help shape The Network from the beginning</SectionHeading>
            <p style={{ ...LEAD, color: BODY_DARK, marginTop: 18 }}>
              We’re inviting a select group of founding partners to help build a new Soccerex platform where football, business and original content meet. A founding partner can shape the conversation, bring its expertise to the audience, create lasting content and build real connections across the Soccerex community.
            </p>
            <p style={{ ...LEAD, color: BODY_DARK, marginTop: 12 }}>
              Partnerships are built around the part of The Network that best fits your business:
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-5" style={{ marginTop: 32 }}>
            {PARTNER_TYPES.map((p, i) => (
              <article key={p.name} className={`flex flex-col ${i < 3 ? 'lg:col-span-2' : 'lg:col-span-3'}`} style={{ background: '#fff', borderRadius: 16, padding: '26px 24px', boxShadow: '0 10px 30px rgba(9,32,62,0.08)', borderTop: `4px solid ${PINK}` }}>
                <h3 className="font-heading" style={{ fontSize: '1.3rem', fontWeight: 700, lineHeight: 1.2 }}>{p.name}</h3>
                <p style={{ color: BODY_DARK, lineHeight: 1.6, marginTop: 8 }}>{p.body}</p>
                {p.list && (
                  <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0 0' }}>
                    {p.list.map(([name, what]) => (
                      <li key={name} style={{ color: BODY_DARK, lineHeight: 1.55, marginTop: 6, fontSize: '0.96rem' }}>
                        <strong style={{ color: NAVY }}>{name}</strong>: {what}
                      </li>
                    ))}
                  </ul>
                )}
                <a href={PARTNER_URL} onClick={() => track('network_partner_inquiry_click', { location: `card:${p.name}` })}
                  className="inline-flex items-center gap-2 font-semibold" style={{ color: NAVY, marginTop: 'auto', paddingTop: 18 }}>
                  Inquire about this role <ArrowRight size={16} />
                </a>
              </article>
            ))}
          </div>
          <p style={{ ...LEAD, color: BODY_DARK, marginTop: 30, maxWidth: 820 }}>
            The founding partner program is for a select group of brands that want to help establish the platform. Each partnership is built around the right editorial fit and agreed deliverables, and we discuss terms directly with each partner.
          </p>
          <div style={{ marginTop: 24 }}><PartnerButton location="partners" /></div>
        </div>
      </section>

      {/* ═══ 08A SIGNATURE PARTNER ASSETS ════════════════════════════════ */}
      <section style={{ padding: PAD }}>
        <div style={WRAP}>
          <div style={{ maxWidth: 820 }}>
            <SectionHeading>Build something with a life beyond the season</SectionHeading>
            <p style={{ ...LEAD, color: INK, marginTop: 16 }}>
              A founding partnership can include the following, with the final scope set in each signed agreement.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" style={{ marginTop: 32 }}>
            {SIGNATURE_ASSETS.map((a) => <AssetCard key={a.name} a={a} />)}
          </div>
          <h3 className="font-heading" style={{ fontSize: 'clamp(1.5rem, 2.4vw, 1.9rem)', fontWeight: 700, marginTop: 56 }}>Distribution, reporting and protection</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ marginTop: 20 }}>
            {DELIVERABLES.map((a) => <AssetCard key={a.name} a={a} />)}
          </div>
          <div style={{ marginTop: 34 }}><PartnerButton location="assets" /></div>
        </div>
      </section>

      {/* ═══ 09 ALL GUESTS + 09A FORMAT ══════════════════════════════════ */}
      <section id="network-guests" style={{ background: NAVY, padding: PAD, scrollMarginTop: 72 }}>
        <div style={WRAP}>
          <SectionHeading>The people behind the game, in their own words</SectionHeading>
          <p style={{ ...LEAD, color: INK, maxWidth: 760, marginTop: 14 }}>
            Every guest has taken a different path into football. Together, their stories reveal the work, ambition and humanity shaping the industry.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" style={{ marginTop: 36 }}>
            {GUESTS.map((g) => <GuestCard key={g.n} g={g} />)}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16" style={{ marginTop: 'clamp(64px,8vw,104px)' }}>
            <div>
              <SectionHeading>Every conversation has room to surprise you</SectionHeading>
              <p style={{ ...LEAD, color: INK, marginTop: 16 }}>
                Diego opens with the guest’s journey. From there, the conversation follows what matters to them: the people who shaped their path, the work they are doing now, the moment something changed and what they believe football should become.
              </p>
            </div>
            <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {SEGMENTS.map((s, i) => (
                <li key={s.name} className="grid grid-cols-[44px_1fr] gap-4 items-baseline"
                  style={{ padding: '16px 0', borderTop: '1px solid rgba(255,255,255,0.12)', ...(i === SEGMENTS.length - 1 ? { borderBottom: '1px solid rgba(255,255,255,0.12)' } : {}) }}>
                  <span className="font-heading" style={{ color: PINK, fontWeight: 700, fontSize: '1.05rem' }}>{i + 1}</span>
                  <div>
                    <h3 className="font-heading" style={{ fontSize: '1.25rem', fontWeight: 700 }}>{s.name}</h3>
                    <p style={{ color: INK, lineHeight: 1.6, marginTop: 2, fontSize: '1rem' }}>{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ═══ 10 AUDIENCE AND DISTRIBUTION ════════════════════════════════ */}
      <section style={{ padding: PAD }}>
        <div style={WRAP}>
          <div style={{ maxWidth: 840 }}>
            <SectionHeading>A conversation that reaches the people shaping the game</SectionHeading>
            <p style={{ ...LEAD, color: INK, marginTop: 16 }}>
              The Network draws on Soccerex’s global football business community, built across clubs, federations, leagues, governing bodies and the companies working throughout the sport. Its priority markets are the United Kingdom, the United States, Brazil, Germany, Spain and Mexico.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4" style={{ marginTop: 32 }}>
            {AUDIENCE.map((a) => (
              <div key={a.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '22px 20px' }}>
                <div className="font-heading" style={{ fontSize: 'clamp(1.8rem, 3.4vw, 2.6rem)', fontWeight: 700, color: '#fff', lineHeight: 1 }}>{a.figure}</div>
                <div style={{ color: INK, marginTop: 8, lineHeight: 1.45, fontSize: '0.95rem' }}>{a.label}</div>
              </div>
            ))}
          </div>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', marginTop: 12 }}>Source: Soccerex audience data, 2026.</p>
          <p style={{ ...LEAD, color: INK, marginTop: 24, maxWidth: 840 }}>
            Every conversation gets a permanent episode page, short-form clips, Soccerex email and social promotion and an asset pack each guest can share. When a club executive or industry leader shares their own episode, the partner branding travels with it into that person’s professional network.
          </p>
        </div>
      </section>

      {/* ═══ 11 GUEST PARTICIPATION ══════════════════════════════════════ */}
      <section id="be-a-guest" style={{ background: NAVY, padding: PAD, scrollMarginTop: 72 }}>
        <div style={WRAP}>
          <SectionHeading>Put your view of the game in front of the people who run it</SectionHeading>
          <p style={{ ...LEAD, color: INK, maxWidth: 800, marginTop: 14 }}>
            Every episode publishes on Soccerex.com, across the Soccerex channels and into the Soccerex email network, and short vertical clips from each conversation run on LinkedIn. The Soccerex network reaches more than 20,000 people at director level or above, including more than 8,000 chief executives, founders, presidents and owners.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5" style={{ marginTop: 32 }}>
            <AssetCard a={{ name: 'About 45 minutes of your time', body: 'Recorded remotely on a video call at a time you choose, then edited into a conversation of about 25 minutes.' }} />
            <AssetCard a={{ name: 'Nothing to prepare', body: 'A laptop, a quiet room and a steady connection are the whole setup. Questions can be sent ahead of time on request.' }} />
            <AssetCard a={{ name: 'Yours to share', body: 'Each guest receives the finished episode, short clips and quote cards for their own channels, and the episode keeps a permanent page on Soccerex.com.' }} />
          </div>
          <a href={GUEST_MAILTO} onClick={() => track('network_guest_inquiry_click')}
            className="inline-flex items-center gap-2 font-semibold"
            style={{ marginTop: 30, border: '1px solid rgba(255,255,255,0.4)', color: '#fff', padding: '13px 24px', borderRadius: 999, fontSize: '1rem' }}>
            <Mail size={18} /> Ask to be considered as a guest
          </a>
        </div>
      </section>

      {/* ═══ 12 VIEWER SIGNUP + FINAL PARTNER CLOSE ══════════════════════ */}
      <section id="notify" style={{ padding: PAD, scrollMarginTop: 72 }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16" style={WRAP}>
          <div>
            <Mic size={28} style={{ color: PINK, marginBottom: 14 }} />
            <SectionHeading>Follow the conversations shaping football’s future</SectionHeading>
            <p style={{ ...LEAD, color: INK, marginTop: 14 }}>Get new conversations and Soccerex updates in your inbox.</p>
            <NotifyForm />
          </div>
          <div style={{ background: `linear-gradient(160deg, ${NAVY} 0%, #12325e 100%)`, borderRadius: 20, padding: 'clamp(28px,4vw,44px)', alignSelf: 'start', border: '1px solid rgba(255,255,255,0.08)' }}>
            <SectionHeading>Help shape what comes next</SectionHeading>
            <p style={{ ...LEAD, color: INK, marginTop: 14 }}>
              If your organization wants to be part of the conversations moving football forward, let’s talk about the right role for you.
            </p>
            <div style={{ marginTop: 26 }}><PartnerButton location="close" /></div>
          </div>
        </div>
      </section>
    </div>
  )
}

function PartnerButton({ location }) {
  return (
    <a href={PARTNER_URL} onClick={() => track('network_partner_inquiry_click', { location })}
      className="inline-flex items-center justify-center gap-2 font-semibold w-full sm:w-auto sm:whitespace-nowrap"
      style={{ background: PINK, color: '#fff', padding: '15px 26px', borderRadius: 999, fontSize: '1rem', textAlign: 'center' }}>
      Inquire about becoming a founding partner <ArrowRight size={18} />
    </a>
  )
}

function SectionHeading({ children, center, dark }) {
  return (
    <h2 className="font-heading font-bold"
      style={{ fontSize: 'clamp(2rem, 3.6vw, 2.9rem)', lineHeight: 1.08, letterSpacing: '-0.01em', textAlign: center ? 'center' : 'left', color: dark ? NAVY : '#fff' }}>
      {children}
    </h2>
  )
}

function GuestCard({ g }) {
  return (
    <article className="flex flex-col" style={{ background: NAVY_DEEP, borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
      <img src={g.img} alt={`${g.guest}, ${g.role}`} loading="lazy" width="560" height="700"
        style={{ width: '100%', aspectRatio: '4 / 5', objectFit: 'cover', objectPosition: 'center 30%', display: 'block' }} />
      <div className="flex flex-col flex-1" style={{ padding: '18px 18px 20px' }}>
        <h3 className="font-heading" style={{ fontSize: '1.3rem', fontWeight: 700, lineHeight: 1.15 }}>{g.guest}</h3>
        <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.62)', lineHeight: 1.4, marginTop: 4 }}>{g.role}</p>
        <p style={{ fontSize: '0.98rem', lineHeight: 1.55, color: '#fff', marginTop: 12 }}>{g.hook}</p>
        <div style={{ marginTop: 'auto', paddingTop: 16 }}>
          {g.watchUrl ? (
            <a href={g.watchUrl} onClick={() => track('network_episode_click', { episode: g.n })}
              className="inline-flex items-center gap-2 font-semibold" style={{ color: PINK, fontSize: '0.95rem' }}>
              Watch now <ArrowRight size={16} />
            </a>
          ) : (
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255,255,255,0.55)' }}>Coming soon</span>
          )}
        </div>
      </div>
    </article>
  )
}

function AssetCard({ a }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '22px 22px' }}>
      <h3 className="font-heading" style={{ fontSize: '1.2rem', fontWeight: 700 }}>{a.name}</h3>
      <p style={{ color: INK, lineHeight: 1.6, marginTop: 8, fontSize: '0.98rem' }}>{a.body}</p>
    </div>
  )
}

function NotifyForm() {
  const [form, setForm] = useState({ name: '', email: '', company: '' })
  const [state, setState] = useState('idle') // idle | sending | sent
  const [error, setError] = useState('')
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setState('sending')
    try {
      /* The lead endpoint requires a message, so the request itself is the message. */
      await submitLead('contact', {
        inquiry_type: 'general',
        name: form.name.trim(),
        email: form.email.trim(),
        company: form.company.trim() || undefined,
        subject: 'The Network',
        message: 'Send me new episodes of The Network and Soccerex updates.',
        source: 'the-network',
        source_url: window.location.href,
        marketing_opt_in: true,
      }, { test: isTestModeFromUrl() })
      setState('sent')
      track('network_newsletter_submit')
    } catch (err) {
      setState('idle')
      setError(err?.message ? `${err.message} You can also email ${SHOW_EMAIL}.` : `That did not go through. Please email ${SHOW_EMAIL}.`)
    }
  }

  if (state === 'sent') {
    return (
      <div role="status" style={{ marginTop: 26, background: 'rgba(255,255,255,0.06)', borderRadius: 14, padding: '26px 22px' }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: PINK, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
          <Check size={22} />
        </div>
        <p className="font-heading" style={{ fontSize: '1.2rem', fontWeight: 700 }}>You’re in the loop, {form.name.trim().split(' ')[0]}.</p>
        <p style={{ color: INK, marginTop: 6 }}>New conversations come to {form.email.trim()} as they publish.</p>
      </div>
    )
  }

  const input = { width: '100%', background: '#fff', color: NAVY, borderRadius: 10, padding: '13px 14px', fontSize: '1rem', border: '1px solid transparent' }
  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 26 }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="block">
          <span className="sr-only">Name</span>
          <input required value={form.name} onChange={set('name')} placeholder="Name" autoComplete="name" maxLength={200} style={input} />
        </label>
        <label className="block">
          <span className="sr-only">Email</span>
          <input required type="email" value={form.email} onChange={set('email')} placeholder="Email" autoComplete="email" maxLength={200} style={input} />
        </label>
        <label className="block sm:col-span-2">
          <span className="sr-only">Organization</span>
          <input value={form.company} onChange={set('company')} placeholder="Organization" autoComplete="organization" maxLength={200} style={input} />
        </label>
      </div>
      {error && <p role="alert" style={{ color: '#ffb4c8', marginTop: 12, fontSize: '0.95rem' }}>{error}</p>}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3" style={{ marginTop: 14 }}>
        <button type="submit" disabled={state === 'sending'} className="inline-flex items-center justify-center gap-2 font-semibold"
          style={{ background: '#fff', color: NAVY, padding: '13px 24px', borderRadius: 999, fontSize: '1rem', opacity: state === 'sending' ? 0.7 : 1, flexShrink: 0 }}>
          {state === 'sending' ? 'Sending' : 'Keep me in the loop'} <ArrowRight size={18} />
        </button>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', lineHeight: 1.45 }}>
          We’ll send The Network and relevant Soccerex updates. You can unsubscribe at any time.
        </p>
      </div>
    </form>
  )
}
