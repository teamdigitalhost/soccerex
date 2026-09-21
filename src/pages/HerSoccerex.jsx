import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'
import PageMeta from '../components/PageMeta'
import HerSoccerexDocument from '../components/HerSoccerexDocument'
import { pageMeta } from '../lib/pageMeta'
import { HERSOCCEREX, HERSOCCEREX_FOUNDING_PDF, MIAMI_2026, PRIVACY_POLICY } from '../lib/routes'
import { submitLead } from '../lib/soccerexApi'
import { isTestModeFromUrl } from '../lib/testMode'
import { HER as C, HER_SERIF as SERIF, HER_ASSETS as ASSETS, herPill as pill } from '../lib/hersoccerexTheme'

/* The launch party opens the community on the first day of Soccerex Miami.
   The sentence about it changes tense once the party has started. */
const LAUNCH_AT = new Date('2026-09-23T16:00:00-04:00')

const CONTACT_EMAIL = 'partner@soccerex.com'

const AUDIENCES = [
  {
    title: 'Women who influence the game',
    body: 'Executives, owners, investors and leaders whose decisions shape clubs, leagues and the companies around them.',
  },
  {
    title: 'Women building their careers',
    body: 'Players, agents, entrepreneurs and emerging professionals looking for the introduction, the mentor or the role that moves them forward.',
  },
  {
    title: 'Allies who can open doors',
    body: 'People across the industry who can make an introduction, champion a career or bring a business conversation to the table.',
  },
]

const PRIORITIES = [
  {
    title: 'Connect',
    body: 'A trusted, influential network that brings established leaders, emerging talent and allies together across every level of the soccer industry.',
  },
  {
    title: 'Create opportunity',
    body: 'Introductions that turn into partnerships, mentorships, new roles and investment conversations, with results we can measure.',
  },
  {
    title: 'Support the whole person',
    body: 'Help for women throughout their careers and beyond them: well-being, professional development, career transitions and access to trusted resources.',
  },
  {
    title: 'Advance the industry',
    body: 'The community’s collective voice, expertise and influence, used to widen opportunities for women in leadership, in business and in every part of the game.',
  },
]

const PILLARS = ['Connection', 'Opportunity', 'Impact']

/* The three ways into the community, in the founding document's own terms.
   The choice travels with the lead so the team can sort replies. */
const ROLES = [
  'A woman with influence in the game',
  'A woman building my career',
  'An ally who can open doors',
]

export default function HerSoccerex() {
  /* Links from elsewhere (the home page's "Join the community") land on a
     section; everything else starts at the top. */
  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (!id) { window.scrollTo(0, 0); return }
    const frame = window.requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView())
    return () => window.cancelAnimationFrame(frame)
  }, [])
  const [launched] = useState(() => Date.now() >= LAUNCH_AT.getTime())

  return (
    <div style={{ background: C.paper, color: C.body }}>
      <PageMeta {...pageMeta(HERSOCCEREX)} />

      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ padding: 'calc(72px + clamp(96px, 11vw, 150px)) clamp(20px, 5vw, 80px) clamp(64px, 8vw, 110px)' }}>
        <img
          src={`${ASSETS}/floral-top-left.webp`} alt="" aria-hidden
          style={{ position: 'absolute', top: 72, left: 0, width: 'clamp(104px, 17vw, 240px)', height: 'auto', pointerEvents: 'none' }}
        />
        <div className="relative text-center" style={{ maxWidth: 820, margin: '0 auto' }}>
          <img
            src={`${ASSETS}/hersoccerex-wellness-universe.webp`}
            alt="HerSoccerex, in collaboration with Wellness Universe Corporate"
            width={800} height={413}
            style={{ width: 'min(360px, 78vw)', height: 'auto', margin: '0 auto', display: 'block' }}
          />
          <Diamond style={{ margin: 'clamp(28px, 4vw, 40px) auto' }} />
          <h1 style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500, color: C.ink, fontSize: 'clamp(2.4rem, 5.6vw, 4.3rem)', lineHeight: 1.08, letterSpacing: '-0.01em' }}>
            Together, we move the game forward.
          </h1>
          <p style={{ fontSize: 'clamp(1.02rem, 1.4vw, 1.15rem)', lineHeight: 1.7, maxWidth: 660, margin: '26px auto 0' }}>
            <Brand /> is a community of women who influence the game, women building their careers in it, and the allies who can open doors for both. We come together with one purpose: turning those relationships into real opportunities.
          </p>
          <blockquote style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 'clamp(1.25rem, 2vw, 1.55rem)', lineHeight: 1.45, color: C.navy, borderLeft: `3px solid ${C.pink}`, padding: '4px 0 4px 20px', maxWidth: 600, margin: '28px auto 0', textAlign: 'left' }}>
            We measure our success by what becomes possible because we were in the same room.
          </blockquote>
          <div className="flex flex-wrap justify-center gap-3" style={{ marginTop: 36 }}>
            <a href="#join" style={pill(true)}>Join HerSoccerex <ArrowRight size={16} /></a>
            <a href={HERSOCCEREX_FOUNDING_PDF} target="_blank" rel="noopener" style={pill(false)}>Read the founding document</a>
          </div>
        </div>
      </section>

      {/* ─── WHO IT IS FOR ────────────────────────────────────────────── */}
      <Section>
        <Heading>Who is <Brand /> for?</Heading>
        <Lead>
          Start with the people. <Brand /> grows out of the reach and relationships Soccerex has built over thirty years in the business of football, and it brings three groups into the same room.
        </Lead>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5" style={{ marginTop: 40 }}>
          {AUDIENCES.map((a) => (
            <div key={a.title} style={{ borderTop: `2px solid ${C.gold}`, paddingTop: 20 }}>
              <h3 style={cardTitle}>{a.title}</h3>
              <p style={cardBody}>{a.body}</p>
            </div>
          ))}
        </div>
        <p style={{ ...cardBody, marginTop: 32, fontSize: '1.02rem' }}>
          The community is open to players, executives, entrepreneurs and every other part of the industry.
        </p>
      </Section>

      {/* ─── MISSION ──────────────────────────────────────────────────── */}
      <Section tone="card">
        <Heading>What is <Brand /> here to do?</Heading>
        <Lead>
          <Brand /> exists to turn the collective influence of women and their allies into meaningful relationships, career opportunities, business growth and lasting progress for women across the soccer industry. Our mission puts that into one sentence.
        </Lead>
        <div style={{ background: '#fff', border: `1px solid ${C.line}`, borderRadius: 10, padding: 'clamp(24px, 4vw, 40px)', marginTop: 36 }}>
          <p style={{ fontFamily: SERIF, fontSize: 'clamp(1.35rem, 2.3vw, 1.75rem)', lineHeight: 1.5, color: C.ink, fontWeight: 500 }}>
            To connect, elevate and empower women across the soccer industry by building a powerful community where relationships create opportunity, business gets done, and collective influence advances women on the pitch, in the boardroom and beyond.
          </p>
        </div>
        <p style={{ ...cardBody, marginTop: 28 }}>The mission rests on three pillars.</p>
        <div className="grid grid-cols-3 gap-3 sm:gap-5" style={{ marginTop: 14 }}>
          {PILLARS.map((p) => (
            <div key={p} style={{ borderTop: `2px solid ${C.gold}`, paddingTop: 14, textAlign: 'center', fontFamily: SERIF, fontWeight: 600, color: C.ink, fontSize: 'clamp(1.1rem, 2vw, 1.4rem)' }}>
              {p}
            </div>
          ))}
        </div>
      </Section>

      {/* ─── PRIORITIES ───────────────────────────────────────────────── */}
      <Section id="building">
        <Heading>What will <Brand /> do for its members?</Heading>
        <Lead>
          The mission turns into four priorities, and everything the community takes on sits under one of them.
        </Lead>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5" style={{ marginTop: 40 }}>
          {PRIORITIES.map((p) => (
            <div key={p.title} style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 10, padding: 'clamp(22px, 3vw, 32px)' }}>
              <h3 style={cardTitle}>{p.title}</h3>
              <p style={cardBody}>{p.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ─── FOUNDING TABLE ───────────────────────────────────────────── */}
      <Section tone="card">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14 items-center">
          <div>
            <Heading>Who is shaping <Brand /> first?</Heading>
            <Lead>
              <Brand /> begins with the Founding Table, a select group of 35 women whose experience, leadership and vision will shape what this community becomes.
            </Lead>
            <p style={{ ...cardBody, fontSize: '1.02rem', marginTop: 18 }}>
              Each founding member brings her experience, relationships, resources and influence to the work. The direction is set, and the details are ours to build together.
            </p>
          </div>
          <figure style={{ background: '#fff', border: `1px solid ${C.line}`, borderRadius: 10, padding: 'clamp(26px, 4vw, 40px)', margin: 0 }}>
            <blockquote style={{ fontFamily: SERIF, fontSize: 'clamp(1.35rem, 2.2vw, 1.7rem)', lineHeight: 1.45, color: C.ink, fontWeight: 500 }}>
              &ldquo;<Brand /> is a community we&rsquo;re building together, and everyone at the table has a role in shaping what comes next.&rdquo;
            </blockquote>
            <figcaption style={{ marginTop: 16, fontSize: '0.92rem', color: C.gold, fontWeight: 600 }}>
              Our founding promise
            </figcaption>
          </figure>
        </div>
      </Section>

      {/* ─── FOUNDING QUESTION ────────────────────────────────────────── */}
      <section style={{ background: C.navy, padding: 'clamp(72px, 9vw, 120px) clamp(20px, 5vw, 80px)' }}>
        <div className="text-center" style={{ maxWidth: 860, margin: '0 auto' }}>
          <h2 style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500, color: '#fff', fontSize: 'clamp(2rem, 4.6vw, 3.4rem)', lineHeight: 1.18 }}>
            &ldquo;What could we accomplish together that we couldn&rsquo;t accomplish alone?&rdquo;
          </h2>
          <Diamond light style={{ margin: '30px auto' }} />
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'clamp(1rem, 1.4vw, 1.12rem)', lineHeight: 1.7, maxWidth: 660, margin: '0 auto' }}>
            This question guides everything we do: it asks women with influence how they want to use it, and it gives women looking for opportunity a voice in what this community needs to become.
          </p>
        </div>
      </section>

      {/* ─── FOUNDING DOCUMENT ────────────────────────────────────────── */}
      <Section id="founding-document">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-14 items-center">
          <div>
            <Heading>Read the founding document</Heading>
            <Lead>
              Keep a copy for yourself, or send it to someone who belongs at the table.
            </Lead>
          </div>
          <HerSoccerexDocument title="HerSoccerex Founding Document" />
        </div>
      </Section>

      {/* ─── JOIN ─────────────────────────────────────────────────────── */}
      <section id="join" className="relative overflow-hidden" style={{ padding: 'clamp(72px, 9vw, 120px) clamp(20px, 5vw, 80px) clamp(96px, 12vw, 160px)', scrollMarginTop: 72 }}>
        <img
          src={`${ASSETS}/floral-bottom-right.webp`} alt="" aria-hidden
          style={{ position: 'absolute', right: 0, bottom: 0, width: 'clamp(96px, 14vw, 200px)', height: 'auto', pointerEvents: 'none' }}
        />
        <div className="relative" style={{ maxWidth: 760, margin: '0 auto' }}>
          <Heading>Join <Brand /></Heading>
          <Lead>
            Tell us who you are and how you would like to take part, and the <Brand /> team will be in touch. The community {launched ? 'launched' : 'launches'} in Miami on September 23, the opening day of <Link to={MIAMI_2026} style={{ color: C.navy, fontWeight: 600 }}>Soccerex Miami 2026</Link>.
          </Lead>
          <JoinForm />
        </div>
      </section>
    </div>
  )
}

function JoinForm() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', company: '', role: '', joiningAs: '', message: '' })
  const [state, setState] = useState('idle') // idle | sending | sent
  const [error, setError] = useState('')
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setState('sending')
    const firstName = form.firstName.trim()
    const lastName = form.lastName.trim()
    /* The lead endpoint requires a message, so the choice and the note are
       written into one, and the choice leads so it reads first in the inbox. */
    const message = [
      `Joining HerSoccerex as: ${form.joiningAs || 'Not specified'}`,
      form.message.trim() ? `\n${form.message.trim()}` : '',
    ].join('\n').trim()
    try {
      await submitLead('contact', {
        inquiry_type: 'general',
        first_name: firstName,
        last_name: lastName || undefined,
        name: [firstName, lastName].filter(Boolean).join(' '),
        email: form.email.trim(),
        company: form.company.trim() || undefined,
        role: form.role.trim() || undefined,
        subject: 'HerSoccerex',
        message,
        source: 'hersoccerex',
        source_url: window.location.href,
      }, { test: isTestModeFromUrl() })
      setState('sent')
    } catch (err) {
      setState('idle')
      setError(err?.message ? `${err.message} You can also email ${CONTACT_EMAIL}.` : `That did not go through. Please email ${CONTACT_EMAIL}.`)
    }
  }

  if (state === 'sent') {
    return (
      <div role="status" style={{ ...formCard, textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: C.pink, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <Check size={24} />
        </div>
        <h3 style={cardTitle}>Thank you, {form.firstName.trim()}.</h3>
        <p style={cardBody}>We have your details, and the HerSoccerex team will be in touch.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={formCard}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="First name" required value={form.firstName} onChange={set('firstName')} autoComplete="given-name" />
        <Field label="Last name" value={form.lastName} onChange={set('lastName')} autoComplete="family-name" />
        <Field label="Email" type="email" required value={form.email} onChange={set('email')} autoComplete="email" />
        <Field label="Organization" value={form.company} onChange={set('company')} autoComplete="organization" />
        <div className="sm:col-span-2">
          <Field label="Role" value={form.role} onChange={set('role')} autoComplete="organization-title" />
        </div>
      </div>

      <fieldset style={{ border: 0, padding: 0, margin: '22px 0 0' }}>
        <legend style={labelStyle}>Which describes you best?</legend>
        <div className="grid grid-cols-1 gap-2" style={{ marginTop: 8 }}>
          {ROLES.map((r) => {
            const on = form.joiningAs === r
            return (
              <label key={r} className="flex items-center gap-3" style={{ cursor: 'pointer', padding: '12px 14px', borderRadius: 8, border: `1px solid ${on ? C.pink : C.line}`, background: on ? 'rgba(231,47,135,0.06)' : '#fff', color: C.ink, fontSize: '0.98rem' }}>
                <input type="radio" name="joiningAs" value={r} checked={on} onChange={set('joiningAs')} style={{ accentColor: C.pink, width: 16, height: 16 }} />
                {r}
              </label>
            )
          })}
        </div>
      </fieldset>

      <label style={{ display: 'block', marginTop: 22 }}>
        <span style={labelStyle}>What would you like to bring to HerSoccerex, or get from it?</span>
        <textarea rows={4} value={form.message} onChange={set('message')} style={{ ...inputStyle, resize: 'vertical', minHeight: 110, marginTop: 8 }} />
      </label>

      {error && <p role="alert" style={{ marginTop: 16, color: '#B42318', fontSize: '0.95rem' }}>{error}</p>}

      <button type="submit" disabled={state === 'sending'} style={{ ...pill(true), width: '100%', justifyContent: 'center', marginTop: 24, border: 0, cursor: state === 'sending' ? 'wait' : 'pointer', opacity: state === 'sending' ? 0.7 : 1 }}>
        {state === 'sending' ? 'Sending…' : <>Join HerSoccerex <ArrowRight size={16} /></>}
      </button>
      <p style={{ marginTop: 14, fontSize: '0.85rem', color: '#6B6F7B', textAlign: 'center' }}>
        We use these details to follow up about HerSoccerex. <Link to={PRIVACY_POLICY} style={{ color: C.navy }}>Privacy Policy</Link>
      </p>
    </form>
  )
}

function Field({ label, required, ...props }) {
  return (
    <label style={{ display: 'block' }}>
      <span style={labelStyle}>{label}{required && <span style={{ color: C.pink }}> *</span>}</span>
      <input required={required} {...props} style={{ ...inputStyle, marginTop: 8 }} />
    </label>
  )
}

function Section({ id, tone, children }) {
  return (
    <section id={id} style={{ background: tone === 'card' ? C.card : C.paper, borderTop: `1px solid ${C.line}`, padding: 'clamp(72px, 9vw, 120px) clamp(20px, 5vw, 80px)', scrollMarginTop: 72 }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>{children}</div>
    </section>
  )
}

function Heading({ children }) {
  return (
    <h2 style={{ fontFamily: SERIF, fontWeight: 500, color: C.ink, fontSize: 'clamp(2.1rem, 4.2vw, 3.2rem)', lineHeight: 1.1 }}>
      {children}
    </h2>
  )
}

function Lead({ children }) {
  return (
    <p style={{ fontSize: 'clamp(1.02rem, 1.35vw, 1.12rem)', lineHeight: 1.7, maxWidth: 720, marginTop: 18 }}>
      {children}
    </p>
  )
}

/* The name as the wordmark sets it: "Her" in pink. */
function Brand() {
  return <span style={{ whiteSpace: 'nowrap' }}><span style={{ color: C.pink }}>Her</span>Soccerex</span>
}

/* The founding document's divider: a gold diamond between two hairlines. */
function Diamond({ light, style }) {
  const rule = light ? 'rgba(255,255,255,0.35)' : C.line
  return (
    <div aria-hidden className="flex items-center justify-center gap-3" style={style}>
      <span style={{ width: 90, height: 1, background: rule }} />
      <span style={{ width: 9, height: 9, background: C.gold, transform: 'rotate(45deg)' }} />
      <span style={{ width: 90, height: 1, background: rule }} />
    </div>
  )
}

const cardTitle = { fontFamily: SERIF, fontWeight: 600, color: C.ink, fontSize: 'clamp(1.55rem, 2.3vw, 1.85rem)', lineHeight: 1.15, marginBottom: 10 }
const cardBody = { fontSize: '1rem', lineHeight: 1.65, color: C.body }
const labelStyle = { display: 'block', fontSize: '0.9rem', fontWeight: 600, color: C.ink }
const inputStyle = { width: '100%', padding: '12px 14px', fontSize: '1rem', background: '#fff', border: `1px solid ${C.line}`, borderRadius: 8, color: C.ink, outline: 'none' }
const formCard = { background: C.card, border: `1px solid ${C.line}`, borderRadius: 12, padding: 'clamp(22px, 4vw, 36px)', marginTop: 36 }
