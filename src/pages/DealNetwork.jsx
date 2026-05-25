import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Handshake, Building2, Users, Briefcase, ArrowRight, Sparkles, Shield,
  Trophy, TrendingUp, Network, Calendar, Crosshair, ClipboardList,
  CheckCircle2, MessagesSquare, Coins, Globe,
} from 'lucide-react'
import NetworkNodes from '../animations/NetworkNodes'
import PixelDivider from '../components/PixelDivider'
import { CONTACT, PROFILE_ACCESS } from '../lib/routes'
import { useScrollAnimations } from '../lib/useScrollAnimations'

/* ═══ Deal Network: public marketing page ═══════════════════════════════
 * No intake form on the public page. Two CTAs route to the application /
 * contact flows. The page leans on a custom ecosystem infographic that
 * mirrors the printed one-pager: ecosystem inputs on the left, the Deal
 * Network hub in the middle, outcomes on the right, and the five-step
 * concierge process across the bottom.
 *
 * Brand palette used here:
 *   navy   #09203e (primary)
 *   gold   var(--color-brand-accent)
 *   purple #6b3aa8 (echoes the printed infographic's secondary accent)
 *   cream  #f4f3f0 (light section background)
 */

const NAVY = '#09203e'
const NAVY_DEEP = '#050d1a'
const PURPLE = '#6b3aa8'
const PURPLE_SOFT = 'rgba(107,58,168,0.10)'

const ECOSYSTEM = [
  {
    icon: Trophy,
    label: 'Rightsholders',
    items: [
      'Federations', 'Leagues', 'Clubs & academies', 'Competitions',
      'Governing bodies', 'Member associations', "Women's football properties",
    ],
  },
  {
    icon: Building2,
    label: 'Commercial Partners',
    items: [
      'Brands & sponsors', 'Agencies & operators', 'Technology providers',
      'Media & broadcasters', 'Service providers & vendors', 'Startups & innovators',
    ],
  },
  {
    icon: Coins,
    label: 'Capital & Innovation Partners',
    items: [
      'Private equity groups', 'Family offices', 'Funds',
      'Strategic investors', 'Financial institutions', 'Foundations & impact partners',
    ],
  },
]

const OUTCOMES = [
  { icon: Users, label: 'Sponsor pipeline', desc: 'Connect with brands, sponsors, and commercial partners aligned to your objectives.' },
  { icon: TrendingUp, label: 'Capital connectivity', desc: 'Access investors, PE groups, family offices, funds, and financial institutions.' },
  { icon: Shield, label: 'Federation & rightsholder pathways', desc: 'Direct routes to federations, leagues, clubs, competitions, and member associations.' },
  { icon: Handshake, label: 'Curated dealmaking', desc: 'Pre-arranged senior meetings with confirmed relevance and high likelihood of follow-up.' },
  { icon: Network, label: 'Strategic introductions', desc: 'Targeted introductions across the football, commercial, capital, and innovation ecosystems.' },
  { icon: Calendar, label: 'Year-round relationship support', desc: 'Ongoing introductions, insights, opportunity flow, and relationship development between events.' },
]

const PROCESS = [
  { n: '01', icon: ClipboardList, label: 'Intake & Align', desc: 'We capture priorities, objectives, and target counterparties from both sides.' },
  { n: '02', icon: Crosshair, label: 'Curate & Match', desc: 'We identify the most relevant, high-intent matches based on fit and objectives.' },
  { n: '03', icon: Calendar, label: 'Pre-Schedule', desc: 'We build a personalised meeting agenda before you arrive.' },
  { n: '04', icon: MessagesSquare, label: 'Facilitate', desc: 'We facilitate 1:1 meetings, roundtables, and deal lunches throughout the event.' },
  { n: '05', icon: CheckCircle2, label: 'Track & Continue', desc: 'We track outcomes and continue creating opportunities year-round.' },
]

const RIGHTSHOLDER_TYPES = [
  'Federations', 'Leagues', 'Clubs', 'Competitions', 'Academies',
  'Governing bodies', 'Member associations',
  "Women's football properties", 'Football development organizations',
]

const PARTNER_TYPES = [
  'Brands and sponsors', 'Agencies and operators', 'Technology providers',
  'Startups and innovators', 'Private equity groups', 'Family offices',
  'Funds', 'Strategic investors', 'Financial institutions',
  'Foundations and nonprofits', 'Impact-focused brands',
  'Media and content platforms', 'Service providers and vendors',
]

const OUTCOME_LIST = [
  'Sponsor pipeline', 'Capital connectivity',
  'Federation and rightsholder pathways', 'Curated dealmaking',
  'Strategic introductions', 'Investment opportunities',
  'Technology and innovation adoption', 'Foundation and impact pathways',
  'Year-round relationship development',
]

const CORE_OFFERINGS = [
  {
    icon: Handshake,
    label: 'Curated 1:1 Meetings',
    desc: 'Pre-arranged meetings with relevant counterparties matched by objective, category, and strategic fit.',
  },
  {
    icon: Users,
    label: 'Roundtables & Deal Lunches',
    desc: 'Closed-door conversations with aligned decision-makers, investors, operators, brands, and rightsholders.',
  },
  {
    icon: Calendar,
    label: 'Year-Round Engagement',
    desc: 'Ongoing introductions, relationship development, and opportunity support between Soccerex editions.',
  },
]

const APPLY_MAILTO = 'mailto:enquiries@soccerex.com?subject=Deal%20Network%20application'

export default function DealNetwork() {
  useScrollAnimations()

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = 'Soccerex Deal Network'
    }
  }, [])

  return (
    <div style={{ background: NAVY_DEEP }}>

      {/* ═══ HERO ════════════════════════════════════════════════════════ */}
      <section className="inner-hero relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0" style={{
          background: `radial-gradient(ellipse at top, #0d2b52 0%, ${NAVY_DEEP} 70%)`,
        }} />
        <NetworkNodes color="#ffffff" accentColor="var(--color-brand-accent)" nodeCount={42} opacity={0.18} />
        <div className="absolute pointer-events-none" style={{
          top: '12%', left: '50%', transform: 'translateX(-50%)',
          width: '900px', height: '900px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(191,177,112,0.12) 0%, transparent 60%)',
        }} />

        <div className="relative z-10 text-center" style={{
          maxWidth: '1000px',
          padding: 'clamp(70px,8vw,130px) clamp(24px,5vw,80px) clamp(60px,7vw,100px)',
        }}>
          <div className="inner-hero-crest flex justify-center fade-up">
            <img src="/brand/crests/crest-main-white.svg" alt="" aria-hidden="true"
              style={{ filter: 'drop-shadow(0 8px 40px rgba(233,30,99,0.3)) drop-shadow(0 0 90px rgba(255,183,3,0.15))' }} />
          </div>
          <p className="section-label text-white mb-5 fade-up" style={{ opacity: 0.85 }}>SOCCEREX DEAL NETWORK</p>
          <h1 className="font-heading font-bold text-white leading-[1.05] mb-6 fade-up text-glow"
              style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4.5rem)' }}>
            From Access to{' '}
            <span style={{ color: 'var(--color-brand-accent)' }}>Commercial Outcomes</span>
          </h1>
          <div className="fade-up mx-auto mb-6" style={{
            width: '100px', height: '3px',
            background: 'linear-gradient(90deg, transparent, var(--color-brand-accent), transparent)',
          }} />
          <p className="font-body text-white/80 leading-relaxed fade-up mx-auto"
             style={{ fontSize: 'clamp(1.05rem, 1.5vw, 1.2rem)', maxWidth: '780px' }}>
            The Soccerex Deal Network is the commercial engine of the Soccerex platform. Built on 30 years of trusted relationships across global football, the Deal Network connects rightsholders, brands, agencies, technology providers, startups, private equity groups, family offices, funds, strategic investors, foundations, and football decision-makers through curated, outcome-driven business engagement.
          </p>

          <div className="fade-up mt-7 mx-auto font-body text-white/65"
               style={{ fontSize: '1rem', maxWidth: '640px', lineHeight: 1.7 }}>
            <p style={{ marginBottom: 8 }}>This is not open networking.</p>
            <p>This is the Soccerex ecosystem activated with purpose.</p>
          </div>

          <p className="font-heading font-semibold fade-up mt-8 mx-auto"
             style={{ color: 'var(--color-brand-accent)', fontSize: 'clamp(1rem, 1.6vw, 1.25rem)', letterSpacing: '0.02em' }}>
            Right people. Right conversations. Right outcomes.
          </p>

          <div className="fade-up mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
               style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', fontFamily: 'Inter, sans-serif' }}>
            <span className="inline-flex items-center gap-2"><Sparkles size={14} style={{ color: 'var(--color-brand-accent)' }} /> Curated, not algorithmic</span>
            <span className="inline-flex items-center gap-2"><Shield size={14} style={{ color: 'var(--color-brand-accent)' }} /> Senior, qualified counterparties</span>
            <span className="inline-flex items-center gap-2"><Globe size={14} style={{ color: 'var(--color-brand-accent)' }} /> Year-round, not just at events</span>
          </div>

          <div className="fade-up mt-10 flex flex-wrap items-center justify-center gap-3">
            <a href={APPLY_MAILTO} className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.15em]"
              style={{ background: 'var(--color-brand-accent)', color: NAVY, padding: '15px 32px', fontSize: '0.78rem', textDecoration: 'none' }}>
              Join the Deal Network <ArrowRight size={15} />
            </a>
            <Link to={CONTACT} className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.15em]"
              style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.25)', padding: '14px 30px', fontSize: '0.78rem', textDecoration: 'none' }}>
              Speak with Soccerex <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <PixelDivider color="#f4f3f0" layers={4} height={90} speed={0.5} />

      {/* ═══ THE ECOSYSTEM IS THE ADVANTAGE ══════════════════════════════ */}
      <section style={{
        background: 'linear-gradient(180deg, #f4f3f0 0%, #efece6 100%)',
        padding: 'clamp(60px,7vw,110px) clamp(24px,5vw,80px) clamp(40px,5vw,80px)',
      }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <div className="text-center mb-12">
            <p className="font-mono uppercase tracking-[0.18em] mb-3 fade-up"
               style={{ fontSize: '0.7rem', color: 'var(--color-brand-accent)', fontWeight: 600 }}>
              The Ecosystem is the Advantage
            </p>
            <h2 className="font-heading font-bold mb-5 fade-up"
                style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)', color: NAVY, lineHeight: 1.15 }}>
              30 years of relationships, activated with structure.
            </h2>
            <p className="font-body mx-auto fade-up"
               style={{ fontSize: '1.02rem', color: '#586778', lineHeight: 1.65, maxWidth: '780px' }}>
              For 30 years, Soccerex has convened the people and organizations that shape global football. The Deal Network turns that ecosystem into a structured commercial platform, connecting the right stakeholders before, during, and after Soccerex events. It is designed to move beyond chance conversations and create qualified meetings, strategic introductions, capital connectivity, and measurable business outcomes.
            </p>
          </div>

          <EcosystemInfographic />

          <p className="font-heading font-semibold text-center fade-up mt-12 mx-auto"
             style={{ fontSize: 'clamp(1.05rem, 1.8vw, 1.35rem)', color: NAVY, maxWidth: '760px', lineHeight: 1.4 }}>
            The Soccerex Deal Network turns ecosystem strength into commercial momentum.
          </p>
        </div>
      </section>

      {/* ═══ WHAT THE DEAL NETWORK DOES ═══════════════════════════════════ */}
      <section style={{
        background: '#fff',
        padding: 'clamp(60px,7vw,100px) clamp(24px,5vw,80px)',
      }}>
        <div style={{ maxWidth: '980px', margin: '0 auto' }}>
          <p className="font-mono uppercase tracking-[0.18em] mb-3 text-center fade-up"
             style={{ fontSize: '0.7rem', color: 'var(--color-brand-accent)', fontWeight: 600 }}>
            What the Deal Network Does
          </p>
          <h2 className="font-heading font-bold text-center mb-10 fade-up"
              style={{ fontSize: 'clamp(1.7rem, 3vw, 2.35rem)', color: NAVY, lineHeight: 1.2 }}>
            Access the right counterparties across the football business ecosystem.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <ConnectsCard
              icon={Trophy}
              from="Rightsholders"
              to="brands, sponsors, agencies, technology providers, investors, foundations, and strategic partners."
            />
            <ConnectsCard
              icon={Building2}
              from="Companies and investors"
              to="federations, leagues, clubs, competitions, member associations, women's football properties, and football development opportunities."
            />
          </div>

          <div className="text-center fade-up">
            <p className="font-body" style={{ fontSize: '1rem', color: '#586778', marginBottom: 10 }}>
              The objective is simple:
            </p>
            <p className="font-heading font-bold"
               style={{ fontSize: 'clamp(1.4rem, 2.6vw, 2rem)', color: NAVY }}>
              Less noise. <span style={{ color: 'var(--color-brand-accent)' }}>More relevance.</span> Better outcomes.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═════════════════════════════════════════════════ */}
      <section style={{
        background: 'linear-gradient(180deg, #f4f3f0 0%, #efece6 100%)',
        padding: 'clamp(60px,7vw,100px) clamp(24px,5vw,80px)',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p className="font-mono uppercase tracking-[0.18em] mb-3 text-center fade-up"
             style={{ fontSize: '0.7rem', color: 'var(--color-brand-accent)', fontWeight: 600 }}>
            How It Works
          </p>
          <h2 className="font-heading font-bold text-center mb-12 fade-up"
              style={{ fontSize: 'clamp(1.7rem, 3vw, 2.35rem)', color: NAVY, lineHeight: 1.2 }}>
            Four moves, before, during, and after the event.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { n: '01', icon: ClipboardList, t: 'Intake',        d: 'Soccerex captures participant goals, priorities, target counterparties, and desired outcomes.' },
              { n: '02', icon: Crosshair,     t: 'Curate',        d: 'We identify relevant matches across the Soccerex ecosystem based on fit, intent, and strategic value.' },
              { n: '03', icon: Handshake,     t: 'Connect',       d: 'We pre-arrange meetings, roundtables, lunches, and executive conversations designed around real business objectives.' },
              { n: '04', icon: CheckCircle2,  t: 'Follow Through',d: 'We track outcomes, support next steps, and continue surfacing opportunities year-round.' },
            ].map((step) => {
              const Icon = step.icon
              return (
                <div key={step.n} className="fade-up" style={{
                  background: '#fff', borderRadius: '14px', padding: '28px 24px',
                  border: '1px solid rgba(9,32,62,0.08)', boxShadow: '0 6px 24px rgba(9,32,62,0.06)',
                  position: 'relative',
                }}>
                  <div className="flex items-center justify-between mb-4">
                    <div style={{
                      width: 42, height: 42, borderRadius: 10,
                      background: PURPLE_SOFT, display: 'grid', placeItems: 'center',
                    }}>
                      <Icon size={20} color={PURPLE} strokeWidth={2.2} />
                    </div>
                    <span className="font-mono" style={{
                      fontSize: '0.7rem', color: 'var(--color-brand-accent)',
                      letterSpacing: '0.18em', fontWeight: 700,
                    }}>{step.n}</span>
                  </div>
                  <h3 className="font-heading font-bold" style={{ fontSize: '1.1rem', color: NAVY, marginBottom: 8 }}>{step.t}</h3>
                  <p className="font-body" style={{ fontSize: '0.9rem', color: '#586778', lineHeight: 1.55 }}>{step.d}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══ WHO IT IS FOR ════════════════════════════════════════════════ */}
      <section style={{ background: '#fff', padding: 'clamp(60px,7vw,100px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p className="font-mono uppercase tracking-[0.18em] mb-3 text-center fade-up"
             style={{ fontSize: '0.7rem', color: 'var(--color-brand-accent)', fontWeight: 600 }}>
            Who It Is For
          </p>
          <h2 className="font-heading font-bold text-center mb-12 fade-up"
              style={{ fontSize: 'clamp(1.7rem, 3vw, 2.35rem)', color: NAVY, lineHeight: 1.2 }}>
            Built for both sides of the table.
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AudienceCard icon={Trophy} title="Rightsholders" items={RIGHTSHOLDER_TYPES} tint={NAVY} />
            <AudienceCard icon={Briefcase} title="Commercial, Capital & Innovation Partners" items={PARTNER_TYPES} tint={PURPLE} />
          </div>
        </div>
      </section>

      {/* ═══ WHAT IT CREATES ══════════════════════════════════════════════ */}
      <section style={{
        background: 'linear-gradient(180deg, #f4f3f0 0%, #efece6 100%)',
        padding: 'clamp(60px,7vw,100px) clamp(24px,5vw,80px)',
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <p className="font-mono uppercase tracking-[0.18em] mb-3 text-center fade-up"
             style={{ fontSize: '0.7rem', color: 'var(--color-brand-accent)', fontWeight: 600 }}>
            What It Creates
          </p>
          <h2 className="font-heading font-bold text-center mb-12 fade-up"
              style={{ fontSize: 'clamp(1.7rem, 3vw, 2.35rem)', color: NAVY, lineHeight: 1.2 }}>
            Concrete outputs, not vague potential.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {OUTCOME_LIST.map((o) => (
              <div key={o} className="fade-up" style={{
                background: '#fff', borderRadius: 10, padding: '14px 18px',
                border: '1px solid rgba(9,32,62,0.08)',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <span style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: 'var(--color-brand-accent)', flexShrink: 0,
                }} />
                <span className="font-body" style={{ fontSize: '0.92rem', color: NAVY, fontWeight: 500 }}>{o}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHY IT MATTERS ═══════════════════════════════════════════════ */}
      <section style={{ background: NAVY, padding: 'clamp(60px,7vw,110px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <p className="font-mono uppercase tracking-[0.18em] mb-3 fade-up"
             style={{ fontSize: '0.7rem', color: 'var(--color-brand-accent)', fontWeight: 600 }}>
            Why It Matters
          </p>
          <h2 className="font-heading font-bold text-white fade-up mb-8"
              style={{ fontSize: 'clamp(1.8rem, 3.4vw, 2.6rem)', lineHeight: 1.2 }}>
            Most events sell access.<br />
            <span style={{ color: 'var(--color-brand-accent)' }}>Soccerex activates the ecosystem behind it.</span>
          </h2>
          <p className="font-body text-white/80 fade-up mx-auto"
             style={{ fontSize: '1.05rem', lineHeight: 1.7, maxWidth: '720px', marginBottom: 18 }}>
            The Deal Network is built to help participants enter the right rooms, meet the right people, and create opportunities that continue beyond the event itself.
          </p>
          <p className="font-body text-white/65 fade-up mx-auto"
             style={{ fontSize: '0.98rem', lineHeight: 1.65, maxWidth: '720px' }}>
            It is where Soccerex moves from convening the football industry to helping the football industry do business.
          </p>
        </div>
      </section>

      {/* ═══ CORE OFFERINGS ═══════════════════════════════════════════════ */}
      <section style={{
        background: 'linear-gradient(180deg, #f4f3f0 0%, #efece6 100%)',
        padding: 'clamp(60px,7vw,100px) clamp(24px,5vw,80px)',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p className="font-mono uppercase tracking-[0.18em] mb-3 text-center fade-up"
             style={{ fontSize: '0.7rem', color: 'var(--color-brand-accent)', fontWeight: 600 }}>
            Core Offerings
          </p>
          <h2 className="font-heading font-bold text-center mb-12 fade-up"
              style={{ fontSize: 'clamp(1.7rem, 3vw, 2.35rem)', color: NAVY, lineHeight: 1.2 }}>
            Three formats, one outcome standard.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {CORE_OFFERINGS.map((off) => {
              const Icon = off.icon
              return (
                <div key={off.label} className="fade-up" style={{
                  background: '#fff', borderRadius: 14, padding: '32px 28px',
                  border: '1px solid rgba(9,32,62,0.08)', boxShadow: '0 8px 28px rgba(9,32,62,0.06)',
                }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: 'linear-gradient(135deg, var(--color-brand-accent), #d4c78e)',
                    display: 'grid', placeItems: 'center', marginBottom: 18,
                  }}>
                    <Icon size={22} color={NAVY} strokeWidth={2.2} />
                  </div>
                  <h3 className="font-heading font-bold" style={{ fontSize: '1.15rem', color: NAVY, marginBottom: 10 }}>{off.label}</h3>
                  <p className="font-body" style={{ fontSize: '0.92rem', color: '#586778', lineHeight: 1.6 }}>{off.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══ JOIN / APPLY ═════════════════════════════════════════════════ */}
      <section style={{ background: NAVY_DEEP, padding: 'clamp(70px,8vw,120px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: '880px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <p className="font-mono uppercase tracking-[0.18em] mb-3 fade-up"
             style={{ fontSize: '0.7rem', color: 'var(--color-brand-accent)', fontWeight: 600 }}>
            Join the Deal Network
          </p>
          <h2 className="font-heading font-bold text-white fade-up mb-6"
              style={{ fontSize: 'clamp(1.9rem, 3.6vw, 2.8rem)', lineHeight: 1.15 }}>
            Available through select participation packages and curated membership pathways.
          </h2>
          <p className="font-body text-white/75 fade-up mx-auto"
             style={{ fontSize: '1.05rem', lineHeight: 1.7, maxWidth: '720px', marginBottom: 32 }}>
            Participants complete a priority intake process so Soccerex can understand their objectives, identify relevant counterparties, and structure the right opportunities.
          </p>

          <div className="fade-up flex flex-wrap items-center justify-center gap-3">
            <a href={APPLY_MAILTO} className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.15em]"
              style={{ background: 'var(--color-brand-accent)', color: NAVY, padding: '17px 38px', fontSize: '0.8rem', textDecoration: 'none' }}>
              Apply to Join the Deal Network <ArrowRight size={16} />
            </a>
            <Link to={CONTACT} className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.15em]"
              style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.25)', padding: '16px 34px', fontSize: '0.8rem', textDecoration: 'none' }}>
              Speak with Soccerex <ArrowRight size={16} />
            </Link>
          </div>

          <p className="font-body fade-up mt-8" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
            Already in the network?{' '}
            <Link to={PROFILE_ACCESS} style={{
              color: 'var(--color-brand-accent)', fontWeight: 600,
              textDecoration: 'underline', textDecorationColor: 'rgba(191,177,112,0.5)',
            }}>
              Sign in to your Deal Network portal
            </Link>
          </p>
        </div>
      </section>

      {/* ═══ CLOSING STATEMENT ════════════════════════════════════════════ */}
      <section style={{ background: '#fff', padding: 'clamp(60px,7vw,100px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: '880px', margin: '0 auto', textAlign: 'center' }}>
          <p className="font-body fade-up" style={{ fontSize: '1.05rem', color: '#586778', lineHeight: 1.7, marginBottom: 12 }}>
            The football industry already gathers at Soccerex.
          </p>
          <p className="font-heading font-bold fade-up mx-auto"
             style={{ fontSize: 'clamp(1.4rem, 2.6vw, 2rem)', color: NAVY, lineHeight: 1.3, maxWidth: '780px', marginBottom: 32 }}>
            The Deal Network ensures that when they arrive, they leave with something to show for it.
          </p>
          <div className="fade-up font-heading font-semibold mx-auto" style={{
            fontSize: 'clamp(1.05rem, 1.8vw, 1.35rem)', color: NAVY, lineHeight: 1.6,
          }}>
            <p style={{ marginBottom: 6 }}>From conversations to opportunities.</p>
            <p style={{ marginBottom: 6 }}>From access to outcomes.</p>
            <p style={{ color: 'var(--color-brand-accent)' }}>From events to a year-round commercial platform.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ═══ Ecosystem Infographic ═══════════════════════════════════════════════
 * Mirrors the printed one-pager: ecosystem inputs (left) → Deal Network hub
 * (center) → outcomes (right), with the 5-step concierge process across the
 * bottom. Pure HTML/CSS so it scales perfectly. Stacks on mobile.
 */
function EcosystemInfographic() {
  return (
    <div className="fade-up" style={{
      background: '#fff', borderRadius: 18, padding: 'clamp(24px,3vw,40px)',
      border: '1px solid rgba(9,32,62,0.08)', boxShadow: '0 16px 48px rgba(9,32,62,0.08)',
    }}>
      <div className="text-center mb-6">
        <p className="font-mono uppercase tracking-[0.18em]"
           style={{ fontSize: '0.65rem', color: PURPLE, fontWeight: 700 }}>
          How the Deal Network activates the Soccerex ecosystem
        </p>
      </div>

      {/* Three-column ecosystem map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
        {/* LEFT: Ecosystem inputs */}
        <div className="flex flex-col gap-3">
          <p className="font-mono uppercase tracking-[0.16em] mb-1"
             style={{ fontSize: '0.62rem', color: 'var(--color-brand-accent)', fontWeight: 700, textAlign: 'center' }}>
            The Soccerex Ecosystem
          </p>
          {ECOSYSTEM.map((group) => {
            const Icon = group.icon
            return (
              <div key={group.label} style={{
                background: '#fafaf7', borderRadius: 12, padding: '16px 16px',
                border: '1px solid rgba(9,32,62,0.06)',
              }}>
                <div className="flex items-center gap-2.5 mb-2">
                  <span style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: 'rgba(191,177,112,0.16)', display: 'grid', placeItems: 'center', flexShrink: 0,
                  }}>
                    <Icon size={16} color="var(--color-brand-accent)" strokeWidth={2.2} />
                  </span>
                  <h4 className="font-heading font-bold" style={{ fontSize: '0.92rem', color: NAVY }}>{group.label}</h4>
                </div>
                <ul className="font-body" style={{ fontSize: '0.78rem', color: '#586778', lineHeight: 1.55, listStyle: 'none', padding: 0, margin: 0 }}>
                  {group.items.map((item) => (
                    <li key={item} style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                      <span style={{ color: 'var(--color-brand-accent)', fontSize: '0.6rem', lineHeight: 1 }}>●</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* CENTER: Hub */}
        <div className="flex flex-col items-center justify-center" style={{ padding: 'clamp(16px, 3vw, 40px) 0' }}>
          <div style={{
            position: 'relative', aspectRatio: '1 / 1', width: '100%', maxWidth: 320,
          }}>
            {/* Outer dotted ring */}
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              border: `2px dashed ${PURPLE}`, opacity: 0.35,
            }} />
            {/* Inner solid ring with gradient */}
            <div style={{
              position: 'absolute', inset: 14, borderRadius: '50%',
              background: `conic-gradient(from 0deg, var(--color-brand-accent) 0%, ${PURPLE} 50%, var(--color-brand-accent) 100%)`,
              padding: 3,
            }}>
              <div style={{
                width: '100%', height: '100%', borderRadius: '50%',
                background: '#fff', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                padding: '0 20px',
              }}>
                <p className="font-heading font-bold" style={{ fontSize: 'clamp(1.05rem, 2vw, 1.4rem)', color: NAVY, lineHeight: 1.15 }}>
                  SOCCEREX<br />DEAL<br />NETWORK
                </p>
                <div style={{ width: 50, height: 2, background: 'var(--color-brand-accent)', margin: '10px auto 8px' }} />
                <p className="font-mono uppercase tracking-[0.14em]" style={{ fontSize: '0.55rem', color: '#7a8896', fontWeight: 600 }}>
                  Curated<br />Pre-scheduled<br />Outcome-driven
                </p>
              </div>
            </div>
          </div>
          <p className="font-body text-center mt-4" style={{ fontSize: '0.78rem', color: '#7a8896', maxWidth: 220, lineHeight: 1.5 }}>
            Every introduction begins and ends here.
          </p>
        </div>

        {/* RIGHT: Outcomes */}
        <div className="flex flex-col gap-3">
          <p className="font-mono uppercase tracking-[0.16em] mb-1"
             style={{ fontSize: '0.62rem', color: PURPLE, fontWeight: 700, textAlign: 'center' }}>
            Outcomes that Drive Value
          </p>
          {OUTCOMES.map((o) => {
            const Icon = o.icon
            return (
              <div key={o.label} style={{
                background: '#fafaf7', borderRadius: 10, padding: '12px 14px',
                border: '1px solid rgba(9,32,62,0.06)',
                display: 'flex', alignItems: 'flex-start', gap: 12,
              }}>
                <span style={{
                  width: 30, height: 30, borderRadius: 8,
                  background: PURPLE_SOFT, display: 'grid', placeItems: 'center', flexShrink: 0,
                }}>
                  <Icon size={15} color={PURPLE} strokeWidth={2.2} />
                </span>
                <div>
                  <h4 className="font-heading font-bold" style={{ fontSize: '0.85rem', color: NAVY, marginBottom: 2, lineHeight: 1.25 }}>{o.label}</h4>
                  <p className="font-body" style={{ fontSize: '0.74rem', color: '#586778', lineHeight: 1.45 }}>{o.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* BOTTOM: 5-step process strip */}
      <div className="mt-8 pt-7" style={{ borderTop: '1px dashed rgba(9,32,62,0.15)' }}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {PROCESS.map((step, idx) => {
            const Icon = step.icon
            return (
              <div key={step.n} style={{ position: 'relative' }}>
                {idx < PROCESS.length - 1 && (
                  <div className="hidden lg:block" style={{
                    position: 'absolute', top: 20, right: '-10px', width: 20, height: 2,
                    background: `linear-gradient(90deg, ${PURPLE}, transparent)`, opacity: 0.4,
                  }} />
                )}
                <div className="flex items-start gap-2.5">
                  <span style={{
                    width: 38, height: 38, borderRadius: '50%',
                    background: PURPLE_SOFT, display: 'grid', placeItems: 'center',
                    flexShrink: 0, border: `1.5px solid ${PURPLE}`,
                  }}>
                    <Icon size={16} color={PURPLE} strokeWidth={2.2} />
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <p className="font-mono" style={{
                      fontSize: '0.6rem', color: 'var(--color-brand-accent)',
                      letterSpacing: '0.16em', fontWeight: 700, marginBottom: 2,
                    }}>{step.n}</p>
                    <h5 className="font-heading font-bold" style={{ fontSize: '0.82rem', color: NAVY, marginBottom: 3, lineHeight: 1.2 }}>{step.label}</h5>
                    <p className="font-body" style={{ fontSize: '0.68rem', color: '#7a8896', lineHeight: 1.4 }}>{step.desc}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ═══ "What the Deal Network Does" card ═══════════════════════════════════ */
function ConnectsCard({ icon: Icon, from, to }) {
  return (
    <div className="fade-up" style={{
      background: '#fafaf7', borderRadius: 14, padding: '24px 24px',
      border: '1px solid rgba(9,32,62,0.08)',
    }}>
      <div className="flex items-center gap-3 mb-3">
        <span style={{
          width: 40, height: 40, borderRadius: 10,
          background: 'rgba(191,177,112,0.18)', display: 'grid', placeItems: 'center',
        }}>
          <Icon size={20} color="var(--color-brand-accent)" strokeWidth={2.2} />
        </span>
        <h3 className="font-heading font-bold" style={{ fontSize: '1.05rem', color: NAVY }}>{from}</h3>
      </div>
      <p className="font-body" style={{ fontSize: '0.92rem', color: '#586778', lineHeight: 1.6 }}>
        connect with <span style={{ color: NAVY, fontWeight: 500 }}>{to}</span>
      </p>
    </div>
  )
}

/* ═══ "Who It Is For" card ═══════════════════════════════════════════════ */
function AudienceCard({ icon: Icon, title, items, tint }) {
  return (
    <div className="fade-up" style={{
      background: '#fafaf7', borderRadius: 16, padding: 'clamp(24px,3vw,36px)',
      border: '1px solid rgba(9,32,62,0.08)', boxShadow: '0 6px 22px rgba(9,32,62,0.05)',
    }}>
      <div className="flex items-center gap-3 mb-5">
        <span style={{
          width: 46, height: 46, borderRadius: 11,
          background: tint === NAVY ? 'rgba(9,32,62,0.08)' : PURPLE_SOFT,
          display: 'grid', placeItems: 'center',
        }}>
          <Icon size={22} color={tint} strokeWidth={2.2} />
        </span>
        <h3 className="font-heading font-bold" style={{ fontSize: '1.2rem', color: NAVY, lineHeight: 1.25 }}>{title}</h3>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {items.map((item) => (
          <li key={item} className="font-body" style={{
            fontSize: '0.88rem', color: '#586778',
            display: 'flex', alignItems: 'baseline', gap: 8,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--color-brand-accent)', flexShrink: 0, transform: 'translateY(-2px)' }} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
