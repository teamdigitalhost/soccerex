import { createElement, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Handshake, Building2, Briefcase, ArrowRight, Sparkles, Shield,
  Trophy, Crosshair, ClipboardList, CheckCircle2, Globe,
  PhoneCall, Mail, CalendarCheck,
} from 'lucide-react'
import NetworkNodes from '../animations/NetworkNodes'
import PixelDivider from '../components/PixelDivider'
import { CONTACT, DEAL_NETWORK_APPLY } from '../lib/routes'
import { useScrollAnimations } from '../lib/useScrollAnimations'

/* ═══ Deal Network: public marketing page ═══════════════════════════════
 * No intake form on the public page. Two CTAs route to the application /
 * contact flows. Copy follows the v4 GN revision doc exactly where it
 * replaces older positioning and offering sections.
 *
 * Brand palette used here:
 *   navy   #09203e (primary)
 *   gold   var(--color-brand-accent)
 *   purple #6b3aa8 (secondary accent)
 *   cream  #f4f3f0 (light section background)
 */

const NAVY = '#09203e'
const NAVY_DEEP = '#050d1a'
const PURPLE = '#6b3aa8'
const PURPLE_SOFT = 'rgba(107,58,168,0.10)'

const RIGHTSHOLDER_TYPES = [
  'Federations', 'Leagues', 'Clubs', 'Competitions', 'Academies',
  'Governing bodies', 'Member associations',
  "Women's football properties", 'Football development organizations',
]

const COMPANY_TYPES = [
  'Brands and sponsors', 'Agencies and operators', 'Technology providers',
  'Startups and innovators', 'Media and content platforms', 'Service providers and vendors',
]

const CAPITAL_IMPACT_TYPES = [
  'Private equity groups', 'Family offices', 'Funds and strategic investors',
  'Financial institutions', 'Foundations and nonprofits', 'Impact-focused brands',
]

const OUTCOME_LIST = [
  'Sponsor pipeline', 'Capital connectivity',
  'Federation and rightsholder pathways', 'Curated dealmaking',
  'Strategic introductions', 'Investment opportunities',
  'Technology and innovation adoption', 'Foundation and impact pathways',
  'Year-round relationship development',
]

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
            Curated Access.{' '}
            <span style={{ color: 'var(--color-brand-accent)' }}>Commercial Outcomes.</span>
          </h1>
          <div className="fade-up mx-auto mb-6" style={{
            width: '100px', height: '3px',
            background: 'linear-gradient(90deg, transparent, var(--color-brand-accent), transparent)',
          }} />
          <p className="font-body text-white/80 leading-relaxed fade-up mx-auto"
             style={{ fontSize: 'clamp(1.05rem, 1.5vw, 1.2rem)', maxWidth: '780px' }}>
            An invite-driven dealmaking platform connecting football decision-makers, rightsholders, capital partners, brands, innovators, and strategic organizations through the Soccerex ecosystem.
          </p>

          <div className="fade-up mt-7 mx-auto font-body text-white/65"
               style={{ fontSize: '1rem', maxWidth: '640px', lineHeight: 1.7 }}>
            <p>Built on 30 years of trusted relationships across global football, the Soccerex Deal Network creates structured access to qualified counterparties and curated opportunities designed to move from introductions to partnerships, investment, innovation, impact, and measurable commercial outcomes.</p>
          </div>

          <p className="font-heading font-semibold fade-up mt-8 mx-auto"
             style={{ color: 'var(--color-brand-accent)', fontSize: 'clamp(1rem, 1.6vw, 1.25rem)', letterSpacing: '0.02em' }}>
            Right people. Right room. Real outcomes.
          </p>

          <div className="fade-up mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
               style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', fontFamily: 'Inter, sans-serif' }}>
            <span className="inline-flex items-center gap-2"><Sparkles size={14} style={{ color: 'var(--color-brand-accent)' }} /> Curated, not algorithmic</span>
            <span className="inline-flex items-center gap-2"><Shield size={14} style={{ color: 'var(--color-brand-accent)' }} /> Senior, qualified counterparties</span>
            <span className="inline-flex items-center gap-2"><Globe size={14} style={{ color: 'var(--color-brand-accent)' }} /> Year-round, not just at events</span>
          </div>

          <div className="fade-up mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link to={DEAL_NETWORK_APPLY} className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.15em]"
              style={{ background: 'var(--color-brand-accent)', color: NAVY, padding: '15px 32px', fontSize: '0.78rem', textDecoration: 'none' }}>
              Request Deal Network access <ArrowRight size={15} />
            </Link>
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
              THE ECOSYSTEM IS THE ADVANTAGE
            </p>
            <h2 className="font-heading font-bold mb-5 fade-up"
                style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)', color: NAVY, lineHeight: 1.15 }}>
              30 Years of Access. Structured for Outcomes.
            </h2>
            <p className="font-body mx-auto fade-up"
               style={{ fontSize: '1.02rem', color: '#586778', lineHeight: 1.65, maxWidth: '780px' }}>
              For 30 years, Soccerex has built trusted relationships across the global football ecosystem. The Deal Network activates that access with structure, connecting the right stakeholders before, during, and after Soccerex events to create qualified meetings, strategic introductions, capital connectivity, and measurable commercial outcomes.
            </p>
          </div>
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
            WHAT THE DEAL NETWORK DOES
          </p>
          <h2 className="font-heading font-bold text-center mb-10 fade-up"
              style={{ fontSize: 'clamp(1.7rem, 3vw, 2.35rem)', color: NAVY, lineHeight: 1.2 }}>
            Connecting the Right Counterparties Across Football Business
          </h2>
          <p className="font-body text-center mx-auto fade-up mb-10" style={{ fontSize: '1rem', color: '#586778', lineHeight: 1.65, maxWidth: 760 }}>
            The Deal Network creates structured access between rightsholders, companies, capital partners, innovators, and strategic organizations across the Soccerex ecosystem.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <ConnectsCard
              icon={Trophy}
              from="Rightsholders"
              to="Connect with brands, sponsors, agencies, technology providers, investors, foundations, and strategic partners aligned with your commercial and growth objectives."
            />
            <ConnectsCard
              icon={Building2}
              from="Companies, Capital & Innovation Partners"
              to="Access federations, leagues, clubs, competitions, member associations, women’s football properties, and football development opportunities through curated Deal Network pathways."
            />
          </div>

          <div className="text-center fade-up">
            <p className="font-body" style={{ fontSize: '1rem', color: '#586778', marginBottom: 10 }}>
              The objective is simple:
            </p>
            <p className="font-heading font-bold"
               style={{ fontSize: 'clamp(1.4rem, 2.6vw, 2rem)', color: NAVY }}>
              Less noise. <span style={{ color: 'var(--color-brand-accent)' }}>More relevance.</span> Higher-value outcomes.
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
            HOW THE DEAL NETWORK WORKS
          </p>
          <h2 className="font-heading font-bold text-center mb-4 fade-up"
              style={{ fontSize: 'clamp(1.7rem, 3vw, 2.35rem)', color: NAVY, lineHeight: 1.2 }}>
            Curated Access, Built to Convert
          </h2>
          <p className="font-body text-center mx-auto fade-up mb-10" style={{ fontSize: '1rem', color: '#586778', lineHeight: 1.65, maxWidth: 760 }}>
            From enrollment to outcomes, a structured six-step process. Soccerex curates the fit, prepares the room, and supports follow-through beyond the event. Every meeting is bilateral, confirmed by both sides before a slot is scheduled.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { n: '01', icon: ClipboardList, t: 'Intake & Profiling',     d: 'Companies and rightsholders complete a tailored intake capturing objectives, target counterparts, and meeting preferences.' },
              { n: '02', icon: PhoneCall,     t: 'Discovery Calls',        d: 'The Soccerex team holds calls to gather richer context and make the matching as precise as possible.' },
              { n: '03', icon: Crosshair,     t: 'Curated Matching',       d: 'Soccerex reviews intake and matches 3 to 5 relevant counterparts per participant by fit, intent, and strategic value.' },
              { n: '04', icon: Mail,          t: 'Introduction Emails',    d: 'Introductions go to both sides, and each participant confirms which proposed counterparties they want to meet.' },
              { n: '05', icon: Handshake,     t: 'Bilateral Confirmation', d: 'A joint email confirms mutual interest and locks the meeting. Only confirmed bilateral interest gets a scheduled slot.' },
              { n: '06', icon: CalendarCheck, t: 'Pre-Scheduled Agenda',   d: 'Every participant receives a personal meeting schedule before the event. No cold approaches on the day.' },
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
            WHO IT IS FOR
          </p>
          <h2 className="font-heading font-bold text-center mb-4 fade-up"
              style={{ fontSize: 'clamp(1.7rem, 3vw, 2.35rem)', color: NAVY, lineHeight: 1.2 }}>
            Built for the Football Business Marketplace
          </h2>
          <p className="font-body text-center mx-auto fade-up mb-10" style={{ fontSize: '1rem', color: '#586778', lineHeight: 1.65, maxWidth: 760 }}>
            The Deal Network brings together three curated groups across the Soccerex ecosystem: rightsholders, companies, and the capital and impact partners that help make deals possible. Every participant is reviewed and approved by Soccerex before being matched.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AudienceCard icon={Trophy} title="Rightsholders" access="Invited, no fee" body="Clubs, leagues, federations, governing bodies, and player representatives. Invited and curated by Soccerex, with no cost to participate." items={RIGHTSHOLDER_TYPES} tint={NAVY} tintBg="rgba(9,32,62,0.08)" />
            <AudienceCard icon={Briefcase} title="Companies" access="Available to Sponsors & Exhibitors" body="Brands, sponsors, agencies, and strategic partners. Deal Network access is included with, or added to, a Soccerex exhibitor or sponsor package." items={COMPANY_TYPES} tint={PURPLE} tintBg={PURPLE_SOFT} />
            <AudienceCard icon={Building2} title="Capital & Impact Partners" access="Curated access, apply to join" body="The third force behind the biggest deals: capital, infrastructure, and mission-driven support. A dedicated curated track, reviewed for mandate fit." items={CAPITAL_IMPACT_TYPES} tint="var(--color-brand-accent)" tintBg="rgba(191,177,112,0.18)" />
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
            WHAT IT CREATES
          </p>
          <h2 className="font-heading font-bold text-center mb-4 fade-up"
              style={{ fontSize: 'clamp(1.7rem, 3vw, 2.35rem)', color: NAVY, lineHeight: 1.2 }}>
            Commercial Outcomes Across the Football Ecosystem
          </h2>
          <p className="font-body text-center mx-auto fade-up mb-10" style={{ fontSize: '1rem', color: '#586778', lineHeight: 1.65, maxWidth: 760 }}>
            The Deal Network is designed to create clear pathways from access to opportunity, helping participants build relationships that can become partnerships, investment, growth, and long-term value.
          </p>

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

      {/* ═══ JOIN / APPLY ═════════════════════════════════════════════════ */}
      <section style={{ background: NAVY_DEEP, padding: 'clamp(70px,8vw,120px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: '880px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <p className="font-mono uppercase tracking-[0.18em] mb-3 fade-up"
             style={{ fontSize: '0.7rem', color: 'var(--color-brand-accent)', fontWeight: 600 }}>
            JOIN THE DEAL NETWORK
          </p>
          <h2 className="font-heading font-bold text-white fade-up mb-6"
              style={{ fontSize: 'clamp(1.9rem, 3.6vw, 2.8rem)', lineHeight: 1.15 }}>
            The football industry already gathers at Soccerex.
          </h2>
          <p className="font-body text-white/75 fade-up mx-auto"
             style={{ fontSize: '1.05rem', lineHeight: 1.7, maxWidth: '720px', marginBottom: 32 }}>
            The Deal Network turns that access into qualified conversations, strategic partnerships, investment opportunities, and measurable commercial outcomes.
          </p>
          <p className="font-heading font-semibold fade-up mx-auto"
             style={{ color: 'var(--color-brand-accent)', fontSize: 'clamp(1.05rem, 1.8vw, 1.35rem)', lineHeight: 1.6, marginBottom: 32 }}>
            Right people. Right room. Real outcomes.
          </p>

          <div className="fade-up flex flex-wrap items-center justify-center gap-3">
            <Link to={DEAL_NETWORK_APPLY} className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.15em]"
              style={{ background: 'var(--color-brand-accent)', color: NAVY, padding: '17px 38px', fontSize: '0.8rem', textDecoration: 'none' }}>
              Request Deal Network access <ArrowRight size={16} />
            </Link>
            <Link to={CONTACT} className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.15em]"
              style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.25)', padding: '16px 34px', fontSize: '0.8rem', textDecoration: 'none' }}>
              Speak with Soccerex <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ═══ "What the Deal Network Does" card ═══════════════════════════════════ */
function ConnectsCard({ icon, from, to }) {
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
          {createElement(icon, { size: 20, color: 'var(--color-brand-accent)', strokeWidth: 2.2 })}
        </span>
        <h3 className="font-heading font-bold" style={{ fontSize: '1.05rem', color: NAVY }}>{from}</h3>
      </div>
      <p className="font-body" style={{ fontSize: '0.92rem', color: '#586778', lineHeight: 1.6 }}>
        <span style={{ color: NAVY, fontWeight: 500 }}>{to}</span>
      </p>
    </div>
  )
}

/* ═══ "Who It Is For" card ═══════════════════════════════════════════════ */
function AudienceCard({ icon, title, body, items, tint, tintBg, access }) {
  return (
    <div className="fade-up" style={{
      background: '#fafaf7', borderRadius: 16, padding: 'clamp(24px,3vw,36px)',
      border: '1px solid rgba(9,32,62,0.08)', boxShadow: '0 6px 22px rgba(9,32,62,0.05)',
    }}>
      {access && (
        <span className="font-mono" style={{
          display: 'inline-block', marginBottom: 16, padding: '5px 12px', borderRadius: 100,
          fontSize: '0.62rem', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700,
          color: tint, background: tintBg || PURPLE_SOFT,
        }}>{access}</span>
      )}
      <div className="flex items-center gap-3 mb-5">
        <span style={{
          width: 46, height: 46, borderRadius: 11,
          background: tintBg || (tint === NAVY ? 'rgba(9,32,62,0.08)' : PURPLE_SOFT),
          display: 'grid', placeItems: 'center',
        }}>
          {createElement(icon, { size: 22, color: tint, strokeWidth: 2.2 })}
        </span>
        <h3 className="font-heading font-bold" style={{ fontSize: '1.2rem', color: NAVY, lineHeight: 1.25 }}>{title}</h3>
      </div>
      {body && (
        <p className="font-body" style={{ fontSize: '0.92rem', color: '#586778', lineHeight: 1.6, marginBottom: 18 }}>
          {body}
        </p>
      )}
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
