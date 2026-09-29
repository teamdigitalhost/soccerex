import { useState } from 'react'
import { ArrowRight, Check, Mic, Mail } from 'lucide-react'
import PageMeta from '../components/PageMeta'
import { pageMeta } from '../lib/pageMeta'
import { THE_NETWORK } from '../lib/routes'
import { submitLead } from '../lib/soccerexApi'
import { isTestModeFromUrl } from '../lib/testMode'

/* ═══ The Network: Soccerex's interview series, hosted by Diego Arrioja ═══
 * The show has not premiered. Episodes list the guest and the ground the
 * conversation covers, and each carries a pull quote taken from the
 * recording itself. When an episode publishes, give it `watchUrl` and the
 * card switches from "Coming soon" to a Watch link.
 *
 * Audience figures come from the guest invitation (Soccerex audience data,
 * 2026). Keep them in step with that document.
 */

const NAVY = '#09203e'
const NAVY_DEEP = '#050d1a'
const PINK = 'var(--color-brand-accent)'
const INK = 'rgba(255,255,255,0.78)'
const IMG = '/images/the-network'
const SHOW_EMAIL = 'thenetwork@soccerex.com'

const EPISODES = [
  {
    n: 1,
    guest: 'Jack Dempsey',
    role: 'Strategic Partnerships and Development Manager, Laurel Springs School',
    topic: 'How players chasing MLS NEXT and European academies keep up with school while they train and travel.',
    quote: 'A lot of them are competing internationally before they have a driver license.',
    img: `${IMG}/ep01.jpg`,
  },
  {
    n: 2,
    guest: 'Jim McCarthy',
    role: 'Founder, Impresario Strategic Growth Services',
    topic: 'Why most clubs still play in front of empty seats, and how pricing and fan-specific tickets fill them.',
    quote: 'Everything you want from your football club comes from a full stadium.',
    img: `${IMG}/ep02.jpg`,
  },
  {
    n: 3,
    guest: 'Michael Donald',
    role: 'Photographer and filmmaker, GOAL!',
    topic: 'Tracking down every living man who has scored in a World Cup final, and what that goal did to the rest of their lives.',
    quote: 'It’s the most exclusive sporting club there is.',
    img: `${IMG}/ep03.jpg`,
  },
  {
    n: 4,
    guest: 'Anna Pereira',
    role: 'Founder and CEO, The Wellness Universe',
    topic: 'What women players and executives need around them as the women’s game grows.',
    quote: 'No matter where we fall on the food chain, we are still human beings.',
    img: `${IMG}/ep04.jpg`,
  },
  {
    n: 5,
    guest: 'Alex Bowden',
    role: 'Founder and CEO, Career Catalyst',
    topic: 'Giving players a plan for the career that starts when the playing one ends.',
    quote: 'People are your capital.',
    img: `${IMG}/ep05.jpg`,
  },
  {
    n: 6,
    guest: 'Danielle Duboc',
    role: 'Executive Director, Fútbol con Corazón',
    topic: 'How a free after-school program turns soccer coaches into mentors, and its own teenagers into coaches.',
    quote: 'The goal is to help move kids from trauma to triumph.',
    img: `${IMG}/ep06.jpg`,
  },
  {
    n: 7,
    guest: 'Ryan Bailey',
    role: 'Chief Operating Officer, Americas, Red Knot',
    topic: 'How soccer grew its audience in the United States, from video games to the World Cup, and how clubs tell their story.',
    quote: 'Why do we watch sport in general? It’s to be entertained.',
    img: `${IMG}/ep07.jpg`,
  },
  {
    n: 8,
    guest: 'Lili Cantero',
    role: 'Artist',
    topic: 'The Paraguayan artist who paints the stories of players onto football boots, and the pair that reached Lionel Messi.',
    quote: 'A boot for me isn’t just an object.',
    img: `${IMG}/ep08.jpg`,
  },
]

/* The run of show, in the order Diego takes it. A typical episode uses five
   or six of these, so the list names the ones that carry the conversation. */
const SEGMENTS = [
  { name: 'Kickoff', body: 'How the guest found their way into football.' },
  { name: 'Starting XI', body: 'What they are building, and why it matters to the game.' },
  { name: 'The Assist', body: 'The work itself: the product, the club, the project in action.' },
  { name: 'The Goal', body: 'Where their corner of football business is heading next.' },
  { name: 'My Soccerex Story', body: 'What the Soccerex community has meant to the way they do business.' },
  { name: 'Final Whistle', body: 'One prediction for the future of the business of football.' },
]

export default function TheNetwork() {
  return (
    <div style={{ background: NAVY_DEEP, color: '#fff' }}>
      <PageMeta {...pageMeta(THE_NETWORK)} />

      {/* ═══ HERO ════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ paddingTop: 72 }}>
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 70% 20%, #12325e 0%, ${NAVY_DEEP} 65%)` }} />
        <div className="relative grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] items-center gap-10 lg:gap-16"
          style={{ maxWidth: 1240, margin: '0 auto', padding: 'clamp(48px,7vw,110px) clamp(20px,5vw,64px) clamp(56px,7vw,110px)' }}>
          <div>
            <div className="flex items-center gap-3" style={{ marginBottom: 22 }}>
              <OnAirDot />
              <span style={{ fontSize: '0.95rem', fontWeight: 600, color: INK }}>Season one premieres soon</span>
            </div>
            <h1 className="font-heading font-bold" style={{ fontSize: 'clamp(3rem, 8vw, 6.2rem)', lineHeight: 0.95, letterSpacing: '-0.02em' }}>
              The Network
            </h1>
            <p className="font-heading" style={{ fontSize: 'clamp(1.35rem, 2.6vw, 2rem)', lineHeight: 1.25, marginTop: 18, color: '#fff', fontWeight: 500 }}>
              Diego Arrioja sits down with the people who run the business of football.
            </p>
            <p style={{ fontSize: 'clamp(1rem, 1.3vw, 1.12rem)', lineHeight: 1.7, color: INK, marginTop: 20, maxWidth: 600 }}>
              Each episode is one guest and one conversation of about 25 minutes. Club executives, founders and the people building the business around the game talk about how they got here, what they are building and where they think football is heading.
            </p>
            <div className="flex flex-wrap gap-3" style={{ marginTop: 32 }}>
              <a href="#notify" className="inline-flex items-center gap-2 font-semibold"
                style={{ background: PINK, color: '#fff', padding: '14px 26px', borderRadius: 999, fontSize: '1rem' }}>
                Get the first episode <ArrowRight size={18} />
              </a>
              <a href="#be-a-guest" className="inline-flex items-center gap-2 font-semibold"
                style={{ border: '1px solid rgba(255,255,255,0.35)', color: '#fff', padding: '14px 26px', borderRadius: 999, fontSize: '1rem' }}>
                Be a guest
              </a>
            </div>
          </div>

          <figure className="relative mx-auto" style={{ width: '100%', maxWidth: 420 }}>
            <div style={{ position: 'absolute', inset: '-10% -12%', background: 'radial-gradient(circle, rgba(233,30,99,0.28) 0%, transparent 62%)', pointerEvents: 'none' }} />
            <img src={`${IMG}/diego-arrioja.jpg`} alt="Diego Arrioja, host of The Network"
              style={{ position: 'relative', width: '100%', aspectRatio: '4 / 5', objectFit: 'cover', objectPosition: 'center 22%', borderRadius: 18, boxShadow: '0 30px 80px rgba(0,0,0,0.45)' }} />
            <figcaption style={{ position: 'relative', marginTop: 14, fontSize: '0.92rem', color: INK }}>
              <strong style={{ color: '#fff' }}>Diego Arrioja</strong>, host. NBCUniversal Telemundo.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ═══ SEASON ONE ══════════════════════════════════════════════════ */}
      <section id="episodes" style={{ background: NAVY, padding: 'clamp(64px,8vw,110px) clamp(20px,5vw,64px)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <SectionHeading>The first guests in the chair</SectionHeading>
          <p style={{ fontSize: 'clamp(1rem, 1.3vw, 1.12rem)', lineHeight: 1.7, color: INK, maxWidth: 760, marginTop: 14 }}>
            Season one was recorded with the club builders, founders and storytellers of the Soccerex community ahead of Soccerex Miami 2026. The guests run from a ticket-pricing strategist and a club communications chief to a Paraguayan artist whose painted boots reached Lionel Messi, and a photographer who tracked down every living man who has scored in a World Cup final.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" style={{ marginTop: 40 }}>
            {EPISODES.map((ep) => <EpisodeCard key={ep.n} ep={ep} />)}
          </div>
        </div>
      </section>

      {/* ═══ FORMAT ══════════════════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(64px,8vw,110px) clamp(20px,5vw,64px)' }}>
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16" style={{ maxWidth: 1240, margin: '0 auto' }}>
          <div>
            <SectionHeading>Every conversation plays out like a match</SectionHeading>
            <p style={{ fontSize: 'clamp(1rem, 1.3vw, 1.12rem)', lineHeight: 1.7, color: INK, marginTop: 14 }}>
              Diego opens with how the guest got into football and closes with a prediction. In between, the guest decides the ground: the story of the business, the thing they are building, or what the industry is getting wrong.
            </p>
            <p style={{ fontSize: 'clamp(1rem, 1.3vw, 1.12rem)', lineHeight: 1.7, color: INK, marginTop: 14 }}>
              Every guest answers the same closing question about where football business is heading, and those answers publish together as a record of what the people running the industry expected to happen.
            </p>
          </div>
          <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {SEGMENTS.map((s, i) => (
              <li key={s.name} className="grid grid-cols-[48px_1fr] gap-4 items-baseline"
                style={{ padding: '18px 0', borderTop: '1px solid rgba(255,255,255,0.12)', ...(i === SEGMENTS.length - 1 ? { borderBottom: '1px solid rgba(255,255,255,0.12)' } : {}) }}>
                <span className="font-heading" style={{ color: PINK, fontWeight: 700, fontSize: '1.05rem' }}>{i + 1}</span>
                <div>
                  <h3 className="font-heading" style={{ fontSize: '1.3rem', fontWeight: 700 }}>{s.name}</h3>
                  <p style={{ color: INK, lineHeight: 1.6, marginTop: 4, fontSize: '1rem' }}>{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ═══ HOST ════════════════════════════════════════════════════════ */}
      <section style={{ background: '#f4f3f0', color: NAVY, padding: 'clamp(64px,8vw,110px) clamp(20px,5vw,64px)' }}>
        <div className="grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-16 items-center" style={{ maxWidth: 1100, margin: '0 auto' }}>
          <img src={`${IMG}/diego-recording.jpg`} alt="Diego Arrioja recording an episode of The Network"
            style={{ width: '100%', maxWidth: 380, aspectRatio: '4 / 5', objectFit: 'cover', borderRadius: 16, margin: '0 auto', boxShadow: '0 24px 60px rgba(9,32,62,0.22)' }} />
          <div>
            <h2 className="font-heading font-bold" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.08, color: NAVY }}>
              The voice of the Soccerex stage, one guest at a time
            </h2>
            <p style={{ fontSize: 'clamp(1rem, 1.3vw, 1.12rem)', lineHeight: 1.75, color: '#3a4a5a', marginTop: 18 }}>
              Diego Arrioja is an Emmy-winning journalist at NBCUniversal Telemundo Enterprises. He co-hosts the daily show El Pelotazo and reports from the Sunday Night Football sideline, and he has covered three FIFA World Cups, the Super Bowl and the UEFA Euro.
            </p>
            <p style={{ fontSize: 'clamp(1rem, 1.3vw, 1.12rem)', lineHeight: 1.75, color: '#3a4a5a', marginTop: 14 }}>
              Soccerex audiences know him from the main stage in Miami and Amsterdam. At Soccerex Miami 2026 he hosted Football Investment Strategies, the FIFA World Cup 26 panel and the Roc Nation Sports International session that DJ Khaled joined. He conducts every conversation in the series himself.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ BE A GUEST ══════════════════════════════════════════════════ */}
      <section id="be-a-guest" style={{ padding: 'clamp(64px,8vw,110px) clamp(20px,5vw,64px)', scrollMarginTop: 72 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <SectionHeading>Put your view of the game in front of the people who run it</SectionHeading>
          <p style={{ fontSize: 'clamp(1rem, 1.3vw, 1.12rem)', lineHeight: 1.7, color: INK, maxWidth: 780, marginTop: 14 }}>
            Every episode publishes on soccerex.com, across the Soccerex channels and into the Soccerex email network. That network reaches 20,000+ people at director level or above, and 8,000+ of them are chief executives, founders, presidents or owners (Soccerex audience data, 2026). Short vertical clips from every conversation run on LinkedIn, where Soccerex has 38,000+ followers.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5" style={{ marginTop: 36 }}>
            <GuestFact title="About 45 minutes of your time">
              Recorded remotely on a video call at a time you choose, then edited to a conversation of about 25 minutes.
            </GuestFact>
            <GuestFact title="Nothing to prepare">
              A laptop, a quiet room and a steady connection are the whole setup. The questions can come to you ahead of time on request.
            </GuestFact>
            <GuestFact title="Yours to share">
              Each guest receives the finished episode, short clips and quote cards for their own channels, and the episode keeps a permanent page here.
            </GuestFact>
          </div>
          <div className="flex flex-wrap items-center gap-4" style={{ marginTop: 34 }}>
            <a href={`mailto:${SHOW_EMAIL}?subject=${encodeURIComponent('The Network: guest inquiry')}`}
              className="inline-flex items-center gap-2 font-semibold"
              style={{ background: '#fff', color: NAVY, padding: '14px 26px', borderRadius: 999, fontSize: '1rem' }}>
              <Mail size={18} /> Ask to be considered
            </a>
            <span style={{ color: INK, fontSize: '0.95rem' }}>
              Guests are invited in small numbers. Write to <a href={`mailto:${SHOW_EMAIL}`} style={{ color: '#fff', textDecoration: 'underline' }}>{SHOW_EMAIL}</a>.
            </span>
          </div>
        </div>
      </section>

      {/* ═══ NOTIFY ══════════════════════════════════════════════════════ */}
      <section id="notify" style={{ background: NAVY, padding: 'clamp(64px,8vw,110px) clamp(20px,5vw,64px)', scrollMarginTop: 72 }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <Mic size={30} style={{ color: PINK, margin: '0 auto 16px' }} />
          <SectionHeading center>Hear the first episode the day it lands</SectionHeading>
          <p style={{ fontSize: 'clamp(1rem, 1.3vw, 1.12rem)', lineHeight: 1.7, color: INK, marginTop: 14 }}>
            Leave your name and email and we will send you each episode as it publishes.
          </p>
          <NotifyForm />
        </div>
      </section>
    </div>
  )
}

function OnAirDot() {
  return (
    <span aria-hidden style={{ position: 'relative', width: 12, height: 12, display: 'inline-block' }}>
      <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: PINK }} />
      <span className="animate-ping" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: PINK, opacity: 0.6 }} />
    </span>
  )
}

function SectionHeading({ children, center }) {
  return (
    <h2 className="font-heading font-bold" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.08, letterSpacing: '-0.01em', textAlign: center ? 'center' : 'left' }}>
      {children}
    </h2>
  )
}

function EpisodeCard({ ep }) {
  return (
    <article className="flex flex-col" style={{ background: NAVY_DEEP, borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="relative">
        <img src={ep.img} alt={`${ep.guest} on The Network`} loading="lazy"
          style={{ width: '100%', aspectRatio: '4 / 5', objectFit: 'cover', objectPosition: 'center 30%', display: 'block' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(5,13,26,0.95) 0%, rgba(5,13,26,0) 45%)' }} />
        <span className="font-heading" style={{ position: 'absolute', left: 16, top: 14, background: 'rgba(5,13,26,0.75)', color: '#fff', fontSize: '0.85rem', fontWeight: 700, padding: '5px 10px', borderRadius: 6 }}>
          Episode {ep.n}
        </span>
        <div style={{ position: 'absolute', left: 16, right: 16, bottom: 14 }}>
          <h3 className="font-heading" style={{ fontSize: '1.35rem', fontWeight: 700, lineHeight: 1.15 }}>{ep.guest}</h3>
          <p style={{ fontSize: '0.86rem', color: INK, lineHeight: 1.4, marginTop: 4 }}>{ep.role}</p>
        </div>
      </div>
      <div className="flex flex-col flex-1" style={{ padding: '16px 16px 18px' }}>
        <p style={{ fontSize: '0.98rem', lineHeight: 1.55, color: '#fff' }}>{ep.topic}</p>
        <blockquote style={{ marginTop: 14, paddingLeft: 12, borderLeft: `3px solid ${PINK}`, fontSize: '0.92rem', lineHeight: 1.5, color: INK, fontStyle: 'italic' }}>
          &ldquo;{ep.quote}&rdquo;
        </blockquote>
        <div style={{ marginTop: 'auto', paddingTop: 16 }}>
          {ep.watchUrl ? (
            <a href={ep.watchUrl} className="inline-flex items-center gap-2 font-semibold" style={{ color: PINK, fontSize: '0.95rem' }}>
              Watch the episode <ArrowRight size={16} />
            </a>
          ) : (
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255,255,255,0.55)' }}>Coming soon</span>
          )}
        </div>
      </div>
    </article>
  )
}

function GuestFact({ title, children }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '24px 22px' }}>
      <h3 className="font-heading" style={{ fontSize: '1.2rem', fontWeight: 700 }}>{title}</h3>
      <p style={{ color: INK, lineHeight: 1.6, marginTop: 8, fontSize: '0.98rem' }}>{children}</p>
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
        message: 'Send me each episode of The Network as it publishes.',
        source: 'the-network',
        source_url: window.location.href,
        marketing_opt_in: true,
      }, { test: isTestModeFromUrl() })
      setState('sent')
    } catch (err) {
      setState('idle')
      setError(err?.message ? `${err.message} You can also email ${SHOW_EMAIL}.` : `That did not go through. Please email ${SHOW_EMAIL}.`)
    }
  }

  if (state === 'sent') {
    return (
      <div role="status" style={{ marginTop: 30, background: 'rgba(255,255,255,0.06)', borderRadius: 14, padding: '28px 24px' }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: PINK, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
          <Check size={22} />
        </div>
        <p className="font-heading" style={{ fontSize: '1.2rem', fontWeight: 700 }}>You are on the list, {form.name.trim().split(' ')[0]}.</p>
        <p style={{ color: INK, marginTop: 6 }}>The first episode comes to {form.email.trim()} the day it publishes.</p>
      </div>
    )
  }

  const input = { width: '100%', background: '#fff', color: NAVY, borderRadius: 10, padding: '13px 14px', fontSize: '1rem', border: '1px solid transparent' }
  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 30, textAlign: 'left' }}>
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
          <input value={form.company} onChange={set('company')} placeholder="Organization (optional)" autoComplete="organization" maxLength={200} style={input} />
        </label>
      </div>
      {error && <p role="alert" style={{ color: '#ffb4c8', marginTop: 12, fontSize: '0.95rem' }}>{error}</p>}
      <button type="submit" disabled={state === 'sending'} className="inline-flex items-center justify-center gap-2 font-semibold w-full"
        style={{ marginTop: 14, background: PINK, color: '#fff', padding: '14px 26px', borderRadius: 999, fontSize: '1rem', opacity: state === 'sending' ? 0.7 : 1 }}>
        {state === 'sending' ? 'Sending' : 'Send me the episodes'} <ArrowRight size={18} />
      </button>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', marginTop: 10, textAlign: 'center' }}>
        We use your email to send The Network and related Soccerex news. You can unsubscribe at any time.
      </p>
    </form>
  )
}
