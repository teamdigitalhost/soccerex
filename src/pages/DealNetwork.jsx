import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Handshake, Building2, Users, Briefcase, ArrowRight, Check, Mail, Phone,
  Globe, MapPin, Target, Compass, Calendar, Sparkles, Lock, Loader2,
  ChevronRight, Link as LinkIcon, Shield,
} from 'lucide-react'
import NetworkNodes from '../animations/NetworkNodes'
import PixelDivider from '../components/PixelDivider'
import { submitDealNetworkIntake } from '../lib/soccerexApi'
import { isTestModeFromUrl, withTestSearch } from '../lib/testMode'
import { CONTACT, MIAMI_2026, PROFILE_ACCESS } from '../lib/routes'

/* ═══ Deal Network — public concierge intake ════════════════════════════════
 * Soccerex curates introductions. This page is the front door for brands,
 * properties, agencies, and rights holders who want to be considered. It is
 * deliberately not a marketplace: nothing here implies instant matching.
 *
 * The form is single-page with progressive sections — the audience is
 * time-pressed senior commercial leaders who would rather scroll than click
 * "Next". Only four fields are required; the rest are framed as helpful.
 *
 * Side options in the UI (4) collapse to the 3 backend values:
 *   brand / sponsor / buyer  -> 'company'
 *   agency / service provider -> 'company'
 *   rights holder / club / venue / federation -> 'rightsholder'
 *   both -> 'both'
 */

const SIDE_OPTIONS = [
  {
    id: 'brand',
    backendValue: 'company',
    label: 'Brand, sponsor, or buyer',
    desc: 'You are looking to invest, sponsor, partner, or buy access into the game.',
    icon: Building2,
  },
  {
    id: 'rightsholder',
    backendValue: 'rightsholder',
    label: 'Club, venue, federation, or rights holder',
    desc: 'You hold the inventory, the audience, or the access counterparties want.',
    icon: Handshake,
  },
  {
    id: 'agency',
    backendValue: 'company',
    label: 'Agency or service provider',
    desc: 'You represent clients or sell services into the football business ecosystem.',
    icon: Briefcase,
  },
  {
    id: 'both',
    backendValue: 'both',
    label: 'I may be both',
    desc: 'You operate on multiple sides depending on the deal.',
    icon: Users,
  },
]

const DEAL_TYPE_OPTIONS = [
  'Sponsorship', 'Media rights', 'Content partnership', 'Technology / platform',
  'Hospitality / experiences', 'Investment / M&A', 'Stadium / venue',
  'Data / analytics', 'Merchandising / licensing', 'Talent / agency', 'Other',
]

const EVENT_OPTIONS = [
  { value: '', label: 'Not tied to a specific event yet' },
  { value: 'soccerex-miami-2026',  label: 'Soccerex Miami 2026' },
  { value: 'soccerex-europe-2026', label: 'Soccerex Europe 2026 (Amsterdam)' },
  { value: 'soccerex-mena-2027',   label: 'Soccerex MENA 2027' },
  { value: 'multiple',             label: 'Multiple Soccerex events' },
]

const BUDGET_OPTIONS = [
  '', 'Under $25k', '$25k – $50k', '$50k – $100k', '$100k – $250k',
  '$250k – $500k', '$500k – $1M', '$1M+', 'Prefer not to say',
]

const MEETING_FORMAT_OPTIONS = [
  { value: '', label: 'No preference' },
  { value: 'curated_intro', label: 'Curated introduction (concierge sets the meeting)' },
  { value: 'group_session', label: 'Group / roundtable session' },
  { value: 'on_site_meeting', label: 'On-site at a Soccerex event' },
  { value: 'virtual_intro', label: 'Virtual introduction first' },
  { value: 'open', label: 'Open to whatever fits' },
]

const REGION_OPTIONS = [
  'Global', 'Americas', 'Europe', 'MENA / GCC', 'Africa', 'Asia', 'Oceania',
]

const LEAGUE_OPTIONS = [
  'MLS', 'Liga MX', 'Premier League', 'La Liga', 'Serie A', 'Bundesliga',
  'Ligue 1', 'Eredivisie', 'CONCACAF', 'CONMEBOL', 'UEFA', 'AFC', 'FIFA',
  'Saudi Pro League', 'NWSL', 'Liga F',
]

const EMPTY_FORM = {
  side: '',
  company_name: '', website: '',
  primary_contact_name: '', primary_contact_title: '',
  primary_contact_email: '', primary_contact_phone: '',
  decision_maker_attending: false,
  deal_types: [],
  one_sentence_pitch: '',
  ideal_counterpart: '',
  named_targets: '',
  primary_geography: '',
  leagues_competitions: [],
  excluded_regions: [],
  deal_description: '',
  budget_range: '',
  decision_timeline: '',
  event_slug: '',
  meeting_format_preference: '',
  specific_people_to_meet: '',
  large_file_links: '',
  previous_context: '',
  sensitivities: '',
  marketing_opt_in: true,
}

function arrayToggle(arr, value) {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]
}

function splitCsv(value) {
  return String(value || '')
    .split(/[\n,]+/g)
    .map((s) => s.trim())
    .filter(Boolean)
}

export default function DealNetwork() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitResult, setSubmitResult] = useState(null)
  const isTest = isTestModeFromUrl()

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = 'Soccerex Deal Network — Concierge Introductions'
    }
  }, [])

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const selectedSide = SIDE_OPTIONS.find((s) => s.id === form.side) || null

  const canSubmit = useMemo(() => Boolean(
    form.side &&
    form.company_name.trim() &&
    form.primary_contact_name.trim() &&
    form.primary_contact_email.trim() &&
    !submitting,
  ), [form, submitting])

  async function handleSubmit(e) {
    e?.preventDefault?.()
    if (!canSubmit) return
    setSubmitting(true)
    setSubmitError('')
    try {
      const sensitivitiesCombined = [
        form.sensitivities.trim(),
        form.large_file_links.trim() ? `Shared files: ${form.large_file_links.trim()}` : '',
      ].filter(Boolean).join('\n\n')

      const payload = {
        side: selectedSide?.backendValue || 'company',
        company_name: form.company_name.trim(),
        website: form.website.trim() || undefined,
        primary_contact_name: form.primary_contact_name.trim(),
        primary_contact_title: form.primary_contact_title.trim() || undefined,
        primary_contact_email: form.primary_contact_email.trim(),
        primary_contact_phone: form.primary_contact_phone.trim() || undefined,
        decision_maker_attending: !!form.decision_maker_attending,
        deal_types: form.deal_types,
        one_sentence_pitch: form.one_sentence_pitch.trim() || undefined,
        deal_description: form.deal_description.trim() || undefined,
        ideal_counterpart: form.ideal_counterpart.trim() || undefined,
        named_targets: splitCsv(form.named_targets),
        primary_geography: form.primary_geography || undefined,
        leagues_competitions: form.leagues_competitions,
        excluded_regions: form.excluded_regions,
        budget_range: form.budget_range || undefined,
        decision_timeline: form.decision_timeline.trim() || undefined,
        event_slug: form.event_slug || undefined,
        event_objectives: form.specific_people_to_meet.trim() || undefined,
        meeting_format_preference: form.meeting_format_preference || undefined,
        specific_people_to_meet: form.specific_people_to_meet.trim() || undefined,
        previous_context: form.previous_context.trim() || undefined,
        sensitivities: sensitivitiesCombined || undefined,
        marketing_opt_in: !!form.marketing_opt_in,
        source: 'frontend-deal-network',
        source_url: typeof window !== 'undefined' ? window.location.href : undefined,
      }
      const result = await submitDealNetworkIntake(payload, { test: isTest })
      setSubmitResult(result || null)
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setSubmitError(err?.message || 'We could not submit your brief. Please email partner@soccerex.com directly.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitResult) {
    return <ConfirmationView result={submitResult} side={selectedSide} />
  }

  return (
    <div style={{ background: '#050d1a' }}>
      {/* ═══ HERO ═════════════════════════════════════════════════════════ */}
      <section className="inner-hero relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at top, #0d2b52 0%, #050d1a 70%)',
        }} />
        <NetworkNodes color="#ffffff" accentColor="var(--color-brand-accent)" nodeCount={42} opacity={0.18} />
        <div className="absolute pointer-events-none" style={{ top: '12%', left: '50%', transform: 'translateX(-50%)', width: '900px', height: '900px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(191,177,112,0.12) 0%, transparent 60%)' }} />
        <div className="relative z-10 text-center" style={{ maxWidth: '1000px', padding: 'clamp(70px,8vw,130px) clamp(24px,5vw,80px) clamp(60px,7vw,100px)' }}>
          <div className="inner-hero-crest flex justify-center fade-up">
            <img src="/brand/crests/crest-main-white.svg" alt="" aria-hidden="true"
              style={{ filter: 'drop-shadow(0 8px 40px rgba(233, 30, 99,0.3)) drop-shadow(0 0 90px rgba(255,183,3,0.15))' }} />
          </div>
          <p className="section-label text-gold mb-5 fade-up">SOCCEREX DEAL NETWORK</p>
          <h1 className="font-heading font-bold text-white leading-[1.05] mb-6 fade-up text-glow" style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4.5rem)' }}>
            Concierge introductions{' '}
            <span style={{ color: 'var(--color-brand-accent)' }}>for serious commercial work.</span>
          </h1>
          <div className="fade-up mx-auto mb-6" style={{ width: '100px', height: '3px', background: 'linear-gradient(90deg, transparent, var(--color-brand-accent), transparent)' }} />
          <p className="font-body text-white/75 leading-relaxed fade-up mx-auto" style={{ fontSize: 'clamp(1.05rem, 1.5vw, 1.2rem)', maxWidth: '760px' }}>
            The Deal Network is a private layer on top of Soccerex profiles. Tell us what you are buying, selling, or looking for, and what would make a meeting worth your time. Our team reviews every brief before any introduction is made.
          </p>

          <div className="fade-up mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
               style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', fontFamily: 'Inter, sans-serif' }}>
            <span className="inline-flex items-center gap-2"><Lock size={14} style={{ color: 'var(--color-brand-accent)' }} /> Private until Soccerex approves a fit</span>
            <span className="inline-flex items-center gap-2"><Sparkles size={14} style={{ color: 'var(--color-brand-accent)' }} /> Curated, not algorithmic</span>
            <span className="inline-flex items-center gap-2"><Shield size={14} style={{ color: 'var(--color-brand-accent)' }} /> No public marketplace</span>
          </div>

          <div className="fade-up mt-10">
            <a href="#intake" className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.15em]"
              style={{ background: 'var(--color-brand-accent)', color: '#09203e', padding: '15px 32px', fontSize: '0.78rem', textDecoration: 'none' }}>
              Submit a brief <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </section>

      <PixelDivider color="#f4f3f0" layers={4} height={90} speed={0.5} />

      {/* ═══ HOW IT WORKS ═════════════════════════════════════════════════ */}
      <section style={{ background: 'linear-gradient(180deg, #f4f3f0 0%, #efece6 100%)', padding: 'clamp(60px,7vw,100px) clamp(24px,5vw,80px) clamp(40px,4vw,60px)' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <p className="font-mono uppercase tracking-[0.18em] mb-3 text-center fade-up" style={{ fontSize: '0.7rem', color: 'var(--color-brand-accent)', fontWeight: 600 }}>
            How the Deal Network works
          </p>
          <h2 className="font-heading font-bold text-center mb-12 fade-up" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.25rem)', color: '#09203e' }}>
            Four steps. No public listings.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {[
              { n: '01', t: 'Submit a brief', d: 'Tell us who you are, what you want, what you can offer, and what kind of introductions would actually move the needle.' },
              { n: '02', t: 'Soccerex reviews', d: 'Our concierge team curates briefs by hand. We weigh fit, seniority, geography, timing, and signal, not just keywords.' },
              { n: '03', t: 'We suggest introductions', d: 'When we see a strong fit, we propose a curated introduction with a clear rationale, and a meeting format that works for both sides.' },
              { n: '04', t: 'Accept, decline, or shape it', d: 'You control your calendar. Accept, decline, or send a note back. Concierge handles scheduling and the room.' },
            ].map((step) => (
              <div key={step.n} className="fade-up" style={{
                background: '#fff', borderRadius: '14px', padding: '28px 24px',
                border: '1px solid rgba(9,32,62,0.08)', boxShadow: '0 6px 24px rgba(9,32,62,0.06)',
              }}>
                <p className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--color-brand-accent)', letterSpacing: '0.18em', fontWeight: 700, marginBottom: 14 }}>{step.n}</p>
                <h3 className="font-heading font-bold" style={{ fontSize: '1.05rem', color: '#09203e', marginBottom: 8 }}>{step.t}</h3>
                <p className="font-body" style={{ fontSize: '0.88rem', color: '#586778', lineHeight: 1.55 }}>{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ INTAKE FORM ══════════════════════════════════════════════════ */}
      <section id="intake" style={{ background: 'linear-gradient(180deg, #efece6 0%, #e7e4dd 100%)', padding: 'clamp(40px,5vw,80px) clamp(24px,5vw,80px) clamp(80px,10vw,140px)' }}>
        <div style={{ maxWidth: '980px', margin: '0 auto' }}>
          <div className="text-center mb-12 fade-up">
            <p className="font-mono uppercase tracking-[0.18em] mb-3" style={{ fontSize: '0.7rem', color: 'var(--color-brand-accent)', fontWeight: 600 }}>
              Your brief
            </p>
            <h2 className="font-heading font-bold mb-3" style={{ fontSize: 'clamp(1.7rem, 3vw, 2.35rem)', color: '#09203e' }}>
              Tell us what would make this useful.
            </h2>
            <p className="font-body" style={{ fontSize: '0.95rem', color: '#586778', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
              Only four fields are required. The rest help our concierge team build a sharper picture. Brief and honest beats long and polished.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{
            background: '#fff', borderRadius: '18px',
            padding: 'clamp(28px,4vw,52px)',
            border: '1px solid rgba(9,32,62,0.08)',
            boxShadow: '0 24px 70px rgba(9,32,62,0.10)',
          }}>
            {/* Section 1: Identity */}
            <SectionHeader number="01" title="Tell us who you are" subtitle="So we know which side of the table you sit on." />

            <div className="mb-8">
              <Label required>Which best describes you?</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                {SIDE_OPTIONS.map((opt) => {
                  const Icon = opt.icon
                  const active = form.side === opt.id
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => update('side', opt.id)}
                      style={{
                        background: active ? '#09203e' : '#f8f7f4',
                        color: active ? '#fff' : '#09203e',
                        border: `1px solid ${active ? '#09203e' : 'rgba(9,32,62,0.10)'}`,
                        borderRadius: '12px',
                        padding: '18px 18px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.22s',
                        boxShadow: active ? '0 14px 32px rgba(9,32,62,0.22)' : 'none',
                      }}
                      onMouseEnter={(e) => { if (!active) e.currentTarget.style.borderColor = 'var(--color-brand-accent)' }}
                      onMouseLeave={(e) => { if (!active) e.currentTarget.style.borderColor = 'rgba(9,32,62,0.10)' }}
                    >
                      <div className="flex items-start gap-3">
                        <div style={{
                          width: 38, height: 38, borderRadius: 9,
                          background: active ? 'var(--color-brand-accent)' : 'rgba(191,177,112,0.14)',
                          display: 'grid', placeItems: 'center', flexShrink: 0,
                        }}>
                          <Icon size={18} color={active ? '#09203e' : 'var(--color-brand-accent)'} strokeWidth={2.2} />
                        </div>
                        <div>
                          <p className="font-heading font-bold" style={{ fontSize: '1rem', marginBottom: 3 }}>{opt.label}</p>
                          <p className="font-body" style={{ fontSize: '0.82rem', opacity: 0.78, lineHeight: 1.5 }}>{opt.desc}</p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <FormField icon={Building2} label="Company / organisation" required value={form.company_name} onChange={(v) => update('company_name', v)} placeholder="Your company name" />
              <FormField icon={Globe} label="Website" type="url" value={form.website} onChange={(v) => update('website', v)} placeholder="https://" />
              <FormField icon={Users} label="Your name" required value={form.primary_contact_name} onChange={(v) => update('primary_contact_name', v)} placeholder="Your name" />
              <FormField icon={Briefcase} label="Title / role" value={form.primary_contact_title} onChange={(v) => update('primary_contact_title', v)} placeholder="Head of Commercial, Founder, etc." />
              <FormField icon={Mail} label="Email" type="email" required value={form.primary_contact_email} onChange={(v) => update('primary_contact_email', v)} placeholder="you@company.com" />
              <FormField icon={Phone} label="Phone or WhatsApp" type="tel" value={form.primary_contact_phone} onChange={(v) => update('primary_contact_phone', v)} placeholder="+1 305 555 0199" />
            </div>

            <Divider />

            {/* Section 2: Objectives */}
            <SectionHeader number="02" title="What are you looking for?" subtitle="A one-line pitch goes further than a paragraph. We will read both." />

            <div className="mb-5">
              <Label>Deal types you are open to</Label>
              <ChipGroup options={DEAL_TYPE_OPTIONS} value={form.deal_types} onChange={(v) => update('deal_types', v)} />
            </div>

            <div className="grid grid-cols-1 gap-4 mb-4">
              <FormField textarea rows={2} label="One-sentence pitch" value={form.one_sentence_pitch} onChange={(v) => update('one_sentence_pitch', v)} placeholder="e.g. We want to meet MLS clubs ready to launch fan data activations in 2026." />
              <FormField textarea rows={3} label="Who would be an ideal counterpart?" value={form.ideal_counterpart} onChange={(v) => update('ideal_counterpart', v)} placeholder="The kind of company, role, or context that would make this worth your time." />
              <FormField textarea rows={2} label="Named targets (optional)" value={form.named_targets} onChange={(v) => update('named_targets', v)} placeholder="Companies, clubs, or people you'd love to meet. One per line or comma-separated." />
            </div>

            <Divider />

            {/* Section 3: Geography & shape */}
            <SectionHeader number="03" title="Geography, budget, and timing" subtitle="Helps us avoid wasting your time on the wrong room." />

            <div className="mb-5">
              <Label>Primary geography</Label>
              <ChipGroup options={REGION_OPTIONS} value={form.primary_geography ? [form.primary_geography] : []} onChange={(arr) => update('primary_geography', arr[arr.length - 1] || '')} single />
            </div>

            <div className="mb-5">
              <Label>Leagues, competitions, or properties you care about</Label>
              <ChipGroup options={LEAGUE_OPTIONS} value={form.leagues_competitions} onChange={(v) => update('leagues_competitions', v)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <SelectField icon={Target} label="Indicative budget range (USD)" value={form.budget_range} onChange={(v) => update('budget_range', v)} options={BUDGET_OPTIONS} />
              <FormField icon={Calendar} label="Decision timeline" value={form.decision_timeline} onChange={(v) => update('decision_timeline', v)} placeholder="e.g. Q3 2026, before Miami, this season" />
            </div>

            <Divider />

            {/* Section 4: Event */}
            <SectionHeader number="04" title="Soccerex event objectives" subtitle="If you have one in mind. If not, leave this blank." />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <SelectField icon={MapPin} label="Which Soccerex event" value={form.event_slug} onChange={(v) => update('event_slug', v)} options={EVENT_OPTIONS} />
              <SelectField icon={Compass} label="Preferred meeting format" value={form.meeting_format_preference} onChange={(v) => update('meeting_format_preference', v)} options={MEETING_FORMAT_OPTIONS} />
            </div>

            <div className="mb-4">
              <FormField textarea rows={3} label="Specific people or roles you want to meet" value={form.specific_people_to_meet} onChange={(v) => update('specific_people_to_meet', v)} placeholder="e.g. Heads of commercial at MLS clubs, federation presidents, family offices." />
            </div>

            <div className="mb-5">
              <Toggle label="A decision-maker from our side plans to attend" value={form.decision_maker_attending} onChange={(v) => update('decision_maker_attending', v)} />
            </div>

            <Divider />

            {/* Section 5: Context */}
            <SectionHeader number="05" title="Anything else worth knowing" subtitle="Context, sensitivities, or supporting links." />

            <div className="grid grid-cols-1 gap-4 mb-4">
              <FormField textarea rows={3} label="Deeper context (optional)" value={form.deal_description} onChange={(v) => update('deal_description', v)} placeholder="Longer explanation if the one-line pitch doesn't capture it. History, scope, what 'good' looks like." />
              <FormField textarea rows={2} label="Previous Soccerex context (optional)" value={form.previous_context} onChange={(v) => update('previous_context', v)} placeholder="Past meetings, deals, or conversations with our team or the network." />
              <div>
                <FormField textarea rows={2} icon={LinkIcon} label="Supporting files (paste links)" value={form.large_file_links} onChange={(v) => update('large_file_links', v)} placeholder="Dropbox, Google Drive, WeTransfer, Box, Notion, etc." />
                <p className="font-body mt-2" style={{ fontSize: '0.78rem', color: '#7a8896', lineHeight: 1.55 }}>
                  Skip uploads. For large decks, brand folders, signage files, or video, paste a shared link, we will review them in context with your brief.
                </p>
              </div>
              <FormField textarea rows={2} label="Sensitivities or things to keep private" value={form.sensitivities} onChange={(v) => update('sensitivities', v)} placeholder="Anything we should not share with counterparts without checking first." />
            </div>

            <div className="mb-7">
              <Toggle label="Keep me on the Soccerex commercial briefing list" value={form.marketing_opt_in} onChange={(v) => update('marketing_opt_in', v)} />
            </div>

            <Divider />

            {/* Submit */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-3">
              <p className="font-body" style={{ fontSize: '0.78rem', color: '#7a8896', maxWidth: '460px', lineHeight: 1.55 }}>
                We review every brief by hand before sharing anything with potential counterparts.
                You will hear back from a Soccerex team member directly, not an automated match.
              </p>
              <button type="submit" disabled={!canSubmit} className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.15em] whitespace-nowrap"
                style={{
                  background: canSubmit ? 'var(--color-brand-accent)' : 'rgba(9,32,62,0.18)',
                  color: '#09203e',
                  padding: '17px 38px',
                  fontSize: '0.82rem',
                  border: 'none',
                  cursor: canSubmit ? 'pointer' : 'not-allowed',
                  transition: 'all 0.25s',
                  opacity: submitting ? 0.7 : 1,
                }}
                onMouseEnter={(e) => { if (canSubmit) e.currentTarget.style.background = '#d4c78e' }}
                onMouseLeave={(e) => { if (canSubmit) e.currentTarget.style.background = 'var(--color-brand-accent)' }}
              >
                {submitting
                  ? <><Loader2 size={16} className="prog-spin" /> Sending</>
                  : <>Submit brief <ArrowRight size={16} /></>}
              </button>
            </div>
            {submitError && (
              <p className="font-body mt-4" style={{ fontSize: '0.85rem', color: '#b91c1c' }}>{submitError}</p>
            )}
          </form>

          {/* Existing member nudge */}
          <div className="mt-10 text-center fade-up">
            <p className="font-body" style={{ fontSize: '0.88rem', color: '#586778' }}>
              Already in the network?{' '}
              <Link to={withTestSearch(PROFILE_ACCESS)} style={{ color: '#09203e', fontWeight: 600, textDecoration: 'underline', textDecorationColor: 'rgba(191,177,112,0.6)' }}>
                Sign in to your Deal Network portal
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ═══ Confirmation view ════════════════════════════════════════════════════ */

function ConfirmationView({ result, side }) {
  const data = result?.data || result || {}
  return (
    <div style={{ background: '#050d1a', minHeight: '100vh' }}>
      <section className="inner-hero relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at top, #0d2b52 0%, #050d1a 70%)',
        }} />
        <NetworkNodes color="#ffffff" accentColor="var(--color-brand-accent)" nodeCount={28} opacity={0.13} />
        <div className="relative z-10 text-center" style={{ maxWidth: '760px', padding: 'clamp(80px,10vw,160px) clamp(24px,5vw,80px)' }}>
          <div style={{
            width: 78, height: 78, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--color-brand-accent), #d4c78e)',
            display: 'grid', placeItems: 'center', margin: '0 auto 32px',
            boxShadow: '0 20px 60px rgba(191,177,112,0.45)',
          }}>
            <Check size={36} color="#09203e" strokeWidth={2.5} />
          </div>
          <p className="section-label text-gold mb-4">Brief received</p>
          <h1 className="font-heading font-bold text-white leading-tight mb-6" style={{ fontSize: 'clamp(1.9rem, 4vw, 3.1rem)' }}>
            Thank you. The Soccerex team takes it from here.
          </h1>
          <p className="font-body text-white/75 leading-relaxed mb-3 mx-auto" style={{ fontSize: 'clamp(1rem, 1.4vw, 1.12rem)', maxWidth: '600px' }}>
            We received your Deal Network brief and will review it before sharing anything with potential counterparts. If there is a fit, our concierge team will reach out with a suggested introduction or next step.
          </p>
          <p className="font-body text-white/55 leading-relaxed mx-auto" style={{ fontSize: '0.92rem', maxWidth: '560px' }}>
            Expect to hear from a real person, usually within two business days. Nothing about your brief is public; we only share what is needed to make a single introduction make sense.
          </p>

          {data.id && (
            <p className="font-mono uppercase tracking-[0.18em] mt-8" style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.42)' }}>
              Reference · {data.id}
              {data.status && <> · {String(data.status).replace(/_/g, ' ')}</>}
            </p>
          )}

          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <Link to={withTestSearch(MIAMI_2026)} className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.15em]"
              style={{ background: 'var(--color-brand-accent)', color: '#09203e', padding: '15px 30px', fontSize: '0.78rem', textDecoration: 'none' }}>
              Explore Miami 2026 <ChevronRight size={15} />
            </Link>
            <Link to={withTestSearch(CONTACT)} className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.15em]"
              style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '14px 30px', fontSize: '0.78rem', textDecoration: 'none' }}>
              Talk to the team <ArrowRight size={15} />
            </Link>
          </div>

          {side && (
            <p className="font-body text-white/45 mt-10" style={{ fontSize: '0.82rem' }}>
              Submitted as <span style={{ color: 'rgba(255,255,255,0.7)' }}>{side.label}</span>.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}

/* ═══ Form primitives ══════════════════════════════════════════════════════ */

function SectionHeader({ number, title, subtitle }) {
  return (
    <div className="mb-6">
      <div className="flex items-baseline gap-3 mb-1">
        <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--color-brand-accent)', letterSpacing: '0.2em', fontWeight: 700 }}>{number}</span>
        <h3 className="font-heading font-bold" style={{ fontSize: '1.2rem', color: '#09203e' }}>{title}</h3>
      </div>
      {subtitle && <p className="font-body" style={{ fontSize: '0.86rem', color: '#7a8896', lineHeight: 1.5, marginLeft: 30 }}>{subtitle}</p>}
    </div>
  )
}

function Divider() {
  return <div style={{ height: 1, background: 'rgba(9,32,62,0.08)', margin: '26px 0 28px' }} />
}

function Label({ children, required }) {
  return (
    <label className="font-mono uppercase tracking-[0.1em] block mb-2" style={{ fontSize: '0.68rem', color: '#09203e', fontWeight: 600 }}>
      {children}{required && <span style={{ color: 'var(--color-brand-accent)', marginLeft: 4 }}>*</span>}
    </label>
  )
}

function FormField({ icon: Icon, label, placeholder, type = 'text', required, textarea, rows = 3, value, onChange }) {
  return (
    <div>
      <Label required={required}>{label}</Label>
      <div style={{ position: 'relative' }}>
        {Icon && !textarea && (
          <Icon size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-brand-accent)', pointerEvents: 'none' }} />
        )}
        {textarea ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            required={required}
            style={textareaStyle}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-brand-accent)'; e.currentTarget.style.background = '#fff' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(9,32,62,0.12)'; e.currentTarget.style.background = '#f8f7f4' }}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            style={Icon ? inputStyleIcon : inputStyle}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-brand-accent)'; e.currentTarget.style.background = '#fff' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(9,32,62,0.12)'; e.currentTarget.style.background = '#f8f7f4' }}
          />
        )}
      </div>
    </div>
  )
}

function SelectField({ icon: Icon, label, value, onChange, options }) {
  return (
    <div>
      <Label>{label}</Label>
      <div style={{ position: 'relative' }}>
        {Icon && (
          <Icon size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-brand-accent)', pointerEvents: 'none', zIndex: 1 }} />
        )}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={Icon ? selectStyleIcon : selectStyle}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-brand-accent)'; e.currentTarget.style.background = '#fff' }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(9,32,62,0.12)'; e.currentTarget.style.background = '#f8f7f4' }}
        >
          {options.map((opt) => {
            const isObj = typeof opt === 'object' && opt !== null
            const v = isObj ? opt.value : opt
            const l = isObj ? opt.label : (opt === '' ? 'Select…' : opt)
            return <option key={v} value={v}>{l}</option>
          })}
        </select>
      </div>
    </div>
  )
}

function ChipGroup({ options, value, onChange, single = false }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value.includes(opt)
        return (
          <button
            key={opt}
            type="button"
            onClick={() => {
              if (single) onChange(active ? [] : [opt])
              else onChange(arrayToggle(value, opt))
            }}
            style={{
              background: active ? '#09203e' : '#f8f7f4',
              color: active ? '#fff' : '#09203e',
              border: `1px solid ${active ? '#09203e' : 'rgba(9,32,62,0.12)'}`,
              borderRadius: 999,
              padding: '8px 14px',
              fontSize: '0.82rem',
              fontFamily: 'Inter, sans-serif',
              cursor: 'pointer',
              transition: 'all 0.18s',
            }}
            onMouseEnter={(e) => { if (!active) e.currentTarget.style.borderColor = 'var(--color-brand-accent)' }}
            onMouseLeave={(e) => { if (!active) e.currentTarget.style.borderColor = 'rgba(9,32,62,0.12)' }}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}

function Toggle({ label, value, onChange }) {
  return (
    <label className="inline-flex items-center gap-3 cursor-pointer" style={{ userSelect: 'none' }}>
      <span
        onClick={() => onChange(!value)}
        style={{
          width: 42, height: 24, borderRadius: 999, position: 'relative',
          background: value ? 'var(--color-brand-accent)' : 'rgba(9,32,62,0.18)',
          transition: 'background 0.2s',
          flexShrink: 0,
        }}
      >
        <span style={{
          position: 'absolute', top: 3, left: value ? 21 : 3,
          width: 18, height: 18, borderRadius: '50%',
          background: '#fff', transition: 'left 0.18s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
        }} />
      </span>
      <span className="font-body" style={{ fontSize: '0.9rem', color: '#09203e' }}>{label}</span>
    </label>
  )
}

const inputStyle = {
  width: '100%', padding: '13px 14px',
  fontSize: '0.92rem', fontFamily: 'Inter, sans-serif',
  background: '#f8f7f4',
  border: '1px solid rgba(9,32,62,0.12)',
  borderRadius: 8, color: '#09203e',
  outline: 'none', transition: 'border-color 0.2s, background 0.2s',
}
const inputStyleIcon = { ...inputStyle, padding: '13px 14px 13px 38px' }
const textareaStyle = { ...inputStyle, resize: 'vertical', minHeight: 88 }
const selectStyle = {
  ...inputStyle,
  appearance: 'none',
  WebkitAppearance: 'none',
  backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 width%3D%2210%22 height%3D%226%22 viewBox%3D%220 0 10 6%22%3E%3Cpath fill%3D%22%2309203e%22 d%3D%22M5 6 0 0h10z%22%2F%3E%3C%2Fsvg%3E")',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 16px center',
  paddingRight: 36,
}
const selectStyleIcon = { ...selectStyle, padding: '13px 36px 13px 38px' }
