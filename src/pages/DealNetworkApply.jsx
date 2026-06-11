import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowRight, Loader2, Mail, CheckCircle2, AlertTriangle, Building2, User as UserIcon, Search, ChevronRight, Lock, Sparkles } from 'lucide-react'
import {
  dealNetworkApplyStart,
  dealNetworkApplyPreview,
  dealNetworkSearchCompanies,
  dealNetworkApplyClaim,
  submitDealNetworkIntake,
  ApiError,
} from '../lib/soccerexApi'
import { INTAKE_FORMS, INTAKE_REGIONS, PAIN_OPTIONS } from '../lib/dealNetworkTaxonomy'
import { isTestModeFromUrl } from '../lib/testMode'

// company Profile type → applicant side. club/federation are rightsholders
// (Property side); everything else is treated as a company (Brand side).
// Mirrors the backend mapping the apply flow already uses.
function deriveSide(company) {
  const t = company?.type
  return t === 'club' || t === 'federation' ? 'property' : 'brand'
}
// Property = rightsholder, Brand = company, Capital = capital — the values
// submitIntake expects. Capital is its own matched side (capital & impact
// partners), not folded into Brand.
const SIDE_TO_BACKEND = { property: 'rightsholder', brand: 'company', capital: 'capital' }

/* Deal Network unlisted apply flow.
 *
 * Step 1: email only → backend emails a magic link
 * Step 2: user clicks the email link → lands here with ?token=...
 * Step 3: preview shows matched person + company; user confirms / corrects
 * Step 4: condensed creation if no match
 * Step 5: matchmaking screen (looking-for, can-offer, deal types, ...)
 * Step 6: confirmation
 *
 * The page is deliberately not linked from the main /deal-network — it is
 * distributed via direct email / QR code / hand-shared link.
 */

const NAVY = '#09203e'
const NAVY_DEEP = '#050d1a'
const PURPLE = '#6b3aa8'
const GOLD = '#8f8136' // capital & impact accent (darker gold for text contrast)

const STEP_EMAIL = 'email'
const STEP_SENT = 'sent'
const STEP_PREVIEW = 'preview'
const STEP_CONDENSED = 'condensed'
const STEP_MATCHMAKING = 'matchmaking'
const STEP_DONE = 'done'

function normalizeApplyEmail(value) {
  return String(value || '').trim().replace(/[.,;:]+$/g, '').toLowerCase()
}

export default function DealNetworkApply() {
  const [params] = useSearchParams()
  const tokenFromUrl = params.get('token') || ''
  const testMode = isTestModeFromUrl()

  // C3: optional ?track= presets the entry side so a tracked link (e.g. from a
  // "Rightsholders" or "Capital & Impact" CTA) lands the applicant on the right
  // capability grid by default. They can still change it via the side selector.
  const trackParam = (params.get('track') || '').toLowerCase()
  const trackSide = (trackParam === 'rightsholder' || trackParam === 'property')
    ? 'property'
    : (trackParam === 'capital' || trackParam === 'investor' || trackParam === 'impact')
      ? 'capital'
      : (trackParam === 'company' || trackParam === 'brand')
        ? 'brand'
        : ''

  const [step, setStep] = useState(tokenFromUrl ? STEP_PREVIEW : STEP_EMAIL)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  // Email step state
  const [email, setEmail] = useState('')
  const [sentMessage, setSentMessage] = useState('')
  const [debugMagicLink, setDebugMagicLink] = useState('')

  // Preview / claim state
  const [token, setToken] = useState(tokenFromUrl)
  const [matched, setMatched] = useState(null) // { person, company, has_matches }
  const [chosenPerson, setChosenPerson] = useState(null)
  const [chosenCompany, setChosenCompany] = useState(null)

  // Condensed form
  const [personName, setPersonName] = useState('')
  const [personTitle, setPersonTitle] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [companyWebsite, setCompanyWebsite] = useState('')
  const [companyCountry, setCompanyCountry] = useState('')
  const [companyIndustry, setCompanyIndustry] = useState('')

  // Company search
  const [companyQuery, setCompanyQuery] = useState('')
  const [companyResults, setCompanyResults] = useState([])

  // Matchmaking — tailored per-side intake (2026-06 intake forms doc)
  const [matchmakingToken, setMatchmakingToken] = useState('')
  const [mm, setMm] = useState({
    side: trackSide || 'brand',
    // company information extras
    website: '', phone: '', attendance: '',
    // about your organization
    organization_type: '', organization_type_other: '',
    league_level: '', industry_sector: '', aum_range: '',
    primary_geography: '', primary_geography_other: '',
    // your deal / mandate
    pitch: '',
    looking_for: [], looking_other: '',
    can_offer: [], offer_other: '',
    pain_points: [], pain_point_detail: '',
    deal_types: [], deal_types_other: '',
    deal_structures: [], deal_structures_other: '',
    // counterpart & parameters
    ideal_counterpart: '', named_targets: '',
    budget_range: '', budget_other: '',
    investment_geography: '', leagues_interest: '',
    decision_timeline: '',
    // additional context
    additional_context: '',
  })

  // Load preview when arriving with a token
  useEffect(() => {
    if (! tokenFromUrl) return
    let cancelled = false
    setBusy(true)
    dealNetworkApplyPreview(tokenFromUrl, { test: testMode })
      .then((res) => {
        if (cancelled) return
        setMatched(res)
        setChosenPerson(res.person)
        setChosenCompany(res.company)
        if (! res.has_matches) {
          setStep(STEP_CONDENSED)
        } else {
          setStep(STEP_PREVIEW)
        }
      })
      .catch((err) => {
        if (cancelled) return
        setError(err?.message || 'This link is invalid or expired.')
        setStep(STEP_EMAIL)
        setToken('')
      })
      .finally(() => !cancelled && setBusy(false))
    return () => { cancelled = true }
  }, [tokenFromUrl, testMode])

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = 'Apply to the Soccerex Deal Network'
    }
  }, [])

  async function handleEmailSubmit(e) {
    e?.preventDefault?.()
    const normalizedEmail = normalizeApplyEmail(email)
    if (! normalizedEmail || busy) return
    setEmail(normalizedEmail)
    setBusy(true); setError('')
    try {
      const res = await dealNetworkApplyStart(normalizedEmail, { test: testMode })
      setSentMessage(res?.message || 'Check your inbox for a confirmation link.')
      setDebugMagicLink(res?.debug?.deal_network_apply_url || '')
      setStep(STEP_SENT)
    } catch (err) {
      setError(err?.message || 'Could not send confirmation link.')
    } finally {
      setBusy(false)
    }
  }

  async function searchCompanies(q) {
    setCompanyQuery(q)
    if (! token || q.trim().length < 2) {
      setCompanyResults([])
      return
    }
    try {
      const res = await dealNetworkSearchCompanies(token, q.trim(), { test: testMode })
      setCompanyResults(Array.isArray(res) ? res : [])
    } catch { /* ignore */ }
  }

  async function handleClaim() {
    setBusy(true); setError('')
    try {
      const payload = { token }
      if (chosenPerson?.id) payload.person_id = chosenPerson.id
      else {
        payload.person_name = personName.trim()
        payload.person_title = personTitle.trim() || undefined
      }
      if (chosenCompany?.id) payload.company_id = chosenCompany.id
      else if (companyName.trim()) {
        payload.company_name = companyName.trim()
        payload.company_website = companyWebsite.trim() || undefined
        payload.company_country = companyCountry.trim() || undefined
        payload.company_industry = companyIndustry.trim() || undefined
      }

      const res = await dealNetworkApplyClaim(payload, { test: testMode })
      setMatchmakingToken(res.matchmaking_token)
      setChosenPerson(res.person)
      setChosenCompany(res.company)
      // Track param wins over the company-type guess (lets a rightsholder who
      // came in on a free-email address land on the property grid).
      setMm((prev) => ({ ...prev, side: trackSide || deriveSide(res.company) }))
      setStep(STEP_MATCHMAKING)
    } catch (err) {
      setError(err?.message || 'Could not save your profile.')
    } finally {
      setBusy(false)
    }
  }

  async function handleMatchmakingSubmit() {
    setBusy(true); setError('')
    try {
      const form = INTAKE_FORMS[mm.side]
      // Only emit signal keys that this side's form actually renders, so a
      // stale tick from a pre-switch selection can never reach the backend's
      // key validation.
      const lookingValid = new Set((form.lookingFor || []).map(([key]) => key))
      const offerValid = new Set((form.canProvide || []).map(([key]) => key))
      const painValid = new Set([...form.pains, 'other'])
      const resolveOther = (value, other) => (value === 'Other' ? (other.trim() || undefined) : (value || undefined))
      const withOther = (list, other) => [...list, ...(other.trim() ? [other.trim()] : [])]
      const splitList = (text) => text.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean)

      await submitDealNetworkIntake({
        side: SIDE_TO_BACKEND[mm.side],
        company_name: chosenCompany?.display_name || companyName,
        primary_contact_name: chosenPerson?.display_name || personName,
        primary_contact_email: email || matched?.email,
        primary_contact_title: personTitle,
        website: mm.website.trim() || companyWebsite.trim() || undefined,
        primary_contact_phone: mm.phone.trim() || undefined,
        decision_maker_attendance: mm.attendance || undefined,
        organization_type: resolveOther(mm.organization_type, mm.organization_type_other),
        league_level: mm.side === 'property' ? (mm.league_level || undefined) : undefined,
        industry_sector: mm.side === 'brand' ? (mm.industry_sector || undefined) : undefined,
        aum_range: mm.side === 'capital' ? (mm.aum_range || undefined) : undefined,
        one_sentence_pitch: mm.pitch.trim().slice(0, 500) || undefined,
        deal_description: mm.pitch.trim() || undefined,
        deal_types: withOther(mm.deal_types, mm.deal_types_other),
        deal_structure_preferences: form.dealStructures ? withOther(mm.deal_structures, mm.deal_structures_other) : undefined,
        ideal_counterpart: mm.ideal_counterpart || undefined,
        named_targets: splitList(mm.named_targets),
        looking_for: mm.looking_for.filter((k) => lookingValid.has(k)),
        looking_for_other: mm.looking_other.trim() || undefined,
        // Capital partners are implicitly capital providers; the doc's capital
        // form has no separate "can provide" question.
        can_offer: mm.side === 'capital' ? ['investment_capital'] : mm.can_offer.filter((k) => offerValid.has(k)),
        can_offer_other: mm.offer_other.trim() || undefined,
        pain_points: mm.pain_points.filter((k) => painValid.has(k)),
        pain_point_detail: mm.pain_point_detail || undefined,
        budget_range: mm.budget_range === 'Other' ? (mm.budget_other.trim() || undefined) : (mm.budget_range || undefined),
        primary_geography: resolveOther(mm.primary_geography, mm.primary_geography_other),
        investment_geography: mm.side === 'capital' ? (mm.investment_geography || undefined) : undefined,
        leagues_competitions: mm.side === 'capital' ? splitList(mm.leagues_interest) : undefined,
        decision_timeline: mm.decision_timeline || undefined,
        additional_context: mm.additional_context.trim() || undefined,
        matchmaking_token: matchmakingToken || undefined,
        source: 'frontend-deal-network-apply',
        source_url: typeof window !== 'undefined' ? window.location.href : undefined,
        marketing_opt_in: true,
      }, { test: testMode })
      setStep(STEP_DONE)
    } catch (err) {
      setError(err?.message || 'Could not submit your application.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ background: NAVY_DEEP, minHeight: '100vh' }}>
      <section className="relative overflow-hidden flex items-center justify-center" style={{ minHeight: '100vh' }}>
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at top, #0d2b52 0%, ${NAVY_DEEP} 70%)` }} />
        <div className="absolute pointer-events-none" style={{ top: '10%', left: '50%', transform: 'translateX(-50%)', width: '900px', height: '900px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(191,177,112,0.10) 0%, transparent 60%)' }} />

        <div className="relative z-10 w-full" style={{ maxWidth: 640, padding: 'clamp(40px,6vw,80px) clamp(20px,4vw,40px)' }}>
          <div className="flex justify-center mb-7">
            <img src="/brand/crests/crest-main-white.svg" alt="Soccerex" style={{ height: 56 }} />
          </div>
          <p className="font-mono uppercase tracking-[0.18em] text-center mb-2" style={{ fontSize: '0.65rem', color: 'var(--color-brand-accent)', fontWeight: 700 }}>
            Soccerex Deal Network
          </p>
          <h1 className="font-heading font-bold text-white text-center mb-6" style={{ fontSize: 'clamp(1.6rem, 3vw, 2rem)', lineHeight: 1.2 }}>
            Apply to join
          </h1>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)', color: '#fecaca' }}>
              <div className="text-sm">{error}</div>
            </div>
          )}

          {step === STEP_EMAIL && <EmailStep email={email} setEmail={setEmail} busy={busy} onSubmit={handleEmailSubmit} />}
          {step === STEP_SENT && <SentStep message={sentMessage} email={email} debugMagicLink={debugMagicLink} />}
          {step === STEP_PREVIEW && matched && (
            <PreviewStep
              matched={matched}
              chosenPerson={chosenPerson} setChosenPerson={setChosenPerson}
              chosenCompany={chosenCompany} setChosenCompany={setChosenCompany}
              companyQuery={companyQuery} companyResults={companyResults} searchCompanies={searchCompanies}
              onContinue={() => {
                if (! chosenPerson || ! chosenCompany) {
                  setStep(STEP_CONDENSED)
                  return
                }
                handleClaim()
              }}
              onNeedCondensed={() => setStep(STEP_CONDENSED)}
              busy={busy}
            />
          )}
          {step === STEP_CONDENSED && (
            <CondensedStep
              chosenPerson={chosenPerson}
              chosenCompany={chosenCompany}
              personName={personName} setPersonName={setPersonName}
              personTitle={personTitle} setPersonTitle={setPersonTitle}
              companyName={companyName} setCompanyName={setCompanyName}
              companyWebsite={companyWebsite} setCompanyWebsite={setCompanyWebsite}
              companyCountry={companyCountry} setCompanyCountry={setCompanyCountry}
              companyIndustry={companyIndustry} setCompanyIndustry={setCompanyIndustry}
              companyQuery={companyQuery} companyResults={companyResults} searchCompanies={searchCompanies}
              pickCompany={(c) => { setChosenCompany(c); setCompanyName('') }}
              busy={busy}
              onContinue={handleClaim}
            />
          )}
          {step === STEP_MATCHMAKING && (
            <MatchmakingStep
              person={chosenPerson} company={chosenCompany}
              mm={mm} setMm={setMm}
              busy={busy} onSubmit={handleMatchmakingSubmit}
            />
          )}
          {step === STEP_DONE && <DoneStep person={chosenPerson} email={email || matched?.email} testMode={testMode} />}
        </div>
      </section>
    </div>
  )
}

function EmailStep({ email, setEmail, busy, onSubmit }) {
  return (
    <form noValidate onSubmit={onSubmit} style={{ background: '#fff', borderRadius: 16, padding: 'clamp(28px,4vw,40px)', boxShadow: '0 30px 80px rgba(0,0,0,0.45)' }}>
      <p className="font-body" style={{ fontSize: '1rem', color: '#586778', marginBottom: 22, lineHeight: 1.6 }}>
        Start with your work email. We'll check our database and let you confirm your details. Most existing contacts can join in under 60 seconds.
      </p>
      <label className="block font-mono uppercase tracking-[0.1em]" style={{ fontSize: '0.68rem', color: NAVY, fontWeight: 600, marginBottom: 8 }}>
        Work email
      </label>
      <div style={{ position: 'relative', marginBottom: 18 }}>
        <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-brand-accent)' }} />
        <input
          type="email" required value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={(e) => setEmail(normalizeApplyEmail(e.target.value))}
          placeholder="you@company.com"
          disabled={busy}
          style={{ width: '100%', padding: '14px 14px 14px 40px', fontSize: '0.95rem', background: '#f8f7f4', border: '1px solid rgba(9,32,62,0.12)', borderRadius: 8, color: NAVY, outline: 'none' }}
        />
      </div>
      <button type="submit" disabled={busy} className="w-full inline-flex items-center justify-center gap-2 font-body font-semibold uppercase tracking-[0.15em]"
        style={{ background: 'var(--color-brand-accent)', color: NAVY, padding: '15px 24px', fontSize: '0.82rem', border: 'none', cursor: busy ? 'wait' : 'pointer', borderRadius: 4 }}>
        {busy ? <><Loader2 size={16} className="animate-spin" /> Sending</> : <>Send confirmation link <ArrowRight size={16} /></>}
      </button>
      <p className="text-center font-body mt-4" style={{ fontSize: '0.75rem', color: '#9aa6b3', lineHeight: 1.5 }}>
        <Lock size={12} className="inline-block mr-1" style={{ marginTop: -2 }} />
        We'll email you a link. Nothing happens until you click it.
      </p>
    </form>
  )
}

function SentStep({ message, email, debugMagicLink }) {
  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: 'clamp(28px,4vw,40px)', boxShadow: '0 30px 80px rgba(0,0,0,0.45)', textAlign: 'center' }}>
      <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#d4f1e1', color: '#166534', display: 'grid', placeItems: 'center', margin: '0 auto 20px' }}>
        <CheckCircle2 size={28} />
      </div>
      <h2 className="font-heading font-bold" style={{ fontSize: '1.3rem', color: NAVY, marginBottom: 10 }}>Check your email</h2>
      <p className="font-body" style={{ fontSize: '0.95rem', color: '#586778', lineHeight: 1.6 }}>
        {message}
      </p>
      <p className="font-body mt-3" style={{ fontSize: '0.85rem', color: '#9aa6b3' }}>
        Sent to <span className="font-mono">{email}</span>
      </p>
      {debugMagicLink && (
        <a
          href={debugMagicLink}
          className="inline-flex items-center justify-center gap-2 font-body font-semibold uppercase tracking-[0.15em] mt-5"
          style={{ background: NAVY, color: '#fff', padding: '12px 18px', fontSize: '0.72rem', borderRadius: 4, textDecoration: 'none' }}
        >
          Open test magic link <ArrowRight size={14} />
        </a>
      )}
    </div>
  )
}

function PreviewStep({ matched, chosenPerson, setChosenPerson, chosenCompany, setChosenCompany, companyQuery, companyResults, searchCompanies, onContinue, onNeedCondensed, busy }) {
  const personMatched = !! matched.person
  const companyMatched = !! matched.company

  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: 'clamp(28px,4vw,40px)', boxShadow: '0 30px 80px rgba(0,0,0,0.45)' }}>
      <p className="font-body" style={{ fontSize: '0.95rem', color: '#586778', lineHeight: 1.6, marginBottom: 20 }}>
        Welcome back. Confirm these are still right and we'll skip straight to the deal-network questions.
      </p>

      <MatchCard
        icon={UserIcon}
        label="You"
        value={chosenPerson?.display_name}
        subtitle={chosenPerson?.headline}
        matched={personMatched && chosenPerson?.id === matched.person?.id}
        onReject={() => { setChosenPerson(null); onNeedCondensed() }}
        rejectLabel="That's not me"
      />

      <MatchCard
        icon={Building2}
        label="Company"
        value={chosenCompany?.display_name}
        subtitle={chosenCompany?.headline || chosenCompany?.type}
        matched={companyMatched && chosenCompany?.id === matched.company?.id}
        onReject={() => setChosenCompany(null)}
        rejectLabel="Not this company"
      />

      {! chosenCompany && (
        <div style={{ marginTop: 16 }}>
          <label className="block font-mono uppercase tracking-[0.1em]" style={{ fontSize: '0.68rem', color: NAVY, fontWeight: 600, marginBottom: 6 }}>
            Find your company
          </label>
          <div style={{ position: 'relative', marginBottom: 8 }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9aa6b3' }} />
            <input
              type="text"
              value={companyQuery}
              onChange={(e) => searchCompanies(e.target.value)}
              placeholder="Type at least 2 letters…"
              style={{ width: '100%', padding: '10px 12px 10px 34px', fontSize: '0.9rem', background: '#f8f7f4', border: '1px solid rgba(9,32,62,0.12)', borderRadius: 6, color: NAVY, outline: 'none' }}
            />
          </div>
          {companyResults.length > 0 && (
            <div style={{ background: '#fafaf7', border: '1px solid rgba(9,32,62,0.08)', borderRadius: 8, maxHeight: 200, overflowY: 'auto' }}>
              {companyResults.map((c) => (
                <button
                  key={c.id} type="button"
                  onClick={() => setChosenCompany(c)}
                  style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(9,32,62,0.06)', cursor: 'pointer' }}
                >
                  <div className="font-body" style={{ fontSize: '0.9rem', color: NAVY, fontWeight: 500 }}>{c.display_name}</div>
                  {c.headline && <div className="font-body" style={{ fontSize: '0.75rem', color: '#7a8896' }}>{c.headline}</div>}
                </button>
              ))}
            </div>
          )}
          <button
            type="button" onClick={onNeedCondensed}
            className="inline-flex items-center gap-1 mt-2 font-mono uppercase tracking-[0.15em]"
            style={{ fontSize: '0.7rem', color: PURPLE, background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            None of these — create new <ChevronRight size={12} />
          </button>
        </div>
      )}

      <button
        type="button" onClick={onContinue} disabled={busy || ! chosenPerson || ! chosenCompany}
        className="w-full mt-6 inline-flex items-center justify-center gap-2 font-body font-semibold uppercase tracking-[0.15em]"
        style={{ background: chosenPerson && chosenCompany ? 'var(--color-brand-accent)' : 'rgba(9,32,62,0.18)', color: NAVY, padding: '15px 24px', fontSize: '0.82rem', border: 'none', cursor: chosenPerson && chosenCompany && ! busy ? 'pointer' : 'not-allowed', borderRadius: 4 }}
      >
        {busy ? <><Loader2 size={16} className="animate-spin" /> Saving</> : <>Continue to deal-network questions <ArrowRight size={16} /></>}
      </button>
    </div>
  )
}

function MatchCard({ icon: Icon, label, value, subtitle, matched, onReject, rejectLabel }) {
  if (! value) return null
  return (
    <div style={{ background: matched ? 'rgba(34,197,94,0.08)' : '#fafaf7', border: '1px solid ' + (matched ? 'rgba(34,197,94,0.25)' : 'rgba(9,32,62,0.08)'), borderRadius: 10, padding: '14px 16px', marginBottom: 12 }}>
      <div className="flex items-start gap-3">
        <span style={{ width: 36, height: 36, borderRadius: 9, background: matched ? 'rgba(34,197,94,0.18)' : 'rgba(9,32,62,0.06)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
          <Icon size={16} color={matched ? '#166534' : NAVY} strokeWidth={2.2} />
        </span>
        <div className="flex-1 min-w-0">
          <div className="font-mono uppercase tracking-[0.16em]" style={{ fontSize: '0.62rem', color: '#7a8896', fontWeight: 600 }}>{label}</div>
          <div className="font-heading font-semibold" style={{ fontSize: '1rem', color: NAVY, marginTop: 2 }}>{value}</div>
          {subtitle && <div className="font-body" style={{ fontSize: '0.82rem', color: '#7a8896', marginTop: 2 }}>{subtitle}</div>}
        </div>
        <button type="button" onClick={onReject} className="font-mono uppercase tracking-[0.14em]" style={{ fontSize: '0.62rem', color: '#9aa6b3', background: 'transparent', border: 'none', cursor: 'pointer', flexShrink: 0, marginTop: 6 }}>
          {rejectLabel}
        </button>
      </div>
    </div>
  )
}

function CondensedStep(props) {
  const { chosenPerson, chosenCompany, personName, setPersonName, personTitle, setPersonTitle, companyName, setCompanyName, companyWebsite, setCompanyWebsite, companyCountry, setCompanyCountry, companyIndustry, setCompanyIndustry, companyQuery, companyResults, searchCompanies, pickCompany, busy, onContinue } = props

  const needsPerson = ! chosenPerson
  const needsCompany = ! chosenCompany

  const canContinue = (! needsPerson || personName.trim() !== '') && (! needsCompany || companyName.trim() !== '')

  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: 'clamp(28px,4vw,40px)', boxShadow: '0 30px 80px rgba(0,0,0,0.45)' }}>
      <p className="font-body" style={{ fontSize: '0.95rem', color: '#586778', lineHeight: 1.6, marginBottom: 20 }}>
        Tell us the basics. You can fill in the full profile later — this just gets you into the deal-network questions.
      </p>

      {needsPerson && (
        <div className="mb-4">
          <div className="font-mono uppercase tracking-[0.16em] mb-3" style={{ fontSize: '0.62rem', color: PURPLE, fontWeight: 700 }}>Your details</div>
          <Field label="Your name" value={personName} onChange={setPersonName} placeholder="Jane Doe" required disabled={busy} />
          <Field label="Title / role" value={personTitle} onChange={setPersonTitle} placeholder="Head of Partnerships" disabled={busy} />
        </div>
      )}

      {needsCompany && (
        <div className="mb-4">
          <div className="font-mono uppercase tracking-[0.16em] mb-3" style={{ fontSize: '0.62rem', color: PURPLE, fontWeight: 700 }}>Your company</div>

          {/* Search first — dedup helper */}
          <label className="block font-mono uppercase tracking-[0.1em]" style={{ fontSize: '0.66rem', color: NAVY, fontWeight: 600, marginBottom: 6 }}>
            Is your company already on Soccerex?
          </label>
          <div style={{ position: 'relative', marginBottom: 8 }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9aa6b3' }} />
            <input
              type="text"
              value={companyQuery}
              onChange={(e) => searchCompanies(e.target.value)}
              placeholder="Search by company name…"
              style={{ width: '100%', padding: '10px 12px 10px 34px', fontSize: '0.9rem', background: '#f8f7f4', border: '1px solid rgba(9,32,62,0.12)', borderRadius: 6, color: NAVY, outline: 'none' }}
            />
          </div>
          {companyResults.length > 0 && (
            <div style={{ background: '#fafaf7', border: '1px solid rgba(9,32,62,0.08)', borderRadius: 8, maxHeight: 200, overflowY: 'auto', marginBottom: 12 }}>
              {companyResults.map((c) => (
                <button
                  key={c.id} type="button"
                  onClick={() => pickCompany(c)}
                  style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(9,32,62,0.06)', cursor: 'pointer' }}
                >
                  <div className="font-body" style={{ fontSize: '0.9rem', color: NAVY, fontWeight: 500 }}>{c.display_name}</div>
                  {c.headline && <div className="font-body" style={{ fontSize: '0.75rem', color: '#7a8896' }}>{c.headline}</div>}
                </button>
              ))}
            </div>
          )}

          <div className="text-center my-3" style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'rgba(9,32,62,0.08)' }} />
            <span style={{ position: 'relative', background: '#fff', padding: '0 12px', fontSize: '0.72rem', color: '#9aa6b3' }}>Or add new</span>
          </div>

          <Field label="Company name" value={companyName} onChange={setCompanyName} placeholder="ACME Marketing Group" required disabled={busy} />
          <Field label="Website" value={companyWebsite} onChange={setCompanyWebsite} placeholder="https://acme.com" type="url" disabled={busy} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Country" value={companyCountry} onChange={setCompanyCountry} placeholder="United Kingdom" disabled={busy} />
            <Field label="Industry" value={companyIndustry} onChange={setCompanyIndustry} placeholder="Sports marketing" disabled={busy} />
          </div>
        </div>
      )}

      <button
        type="button" onClick={onContinue} disabled={busy || ! canContinue}
        className="w-full mt-2 inline-flex items-center justify-center gap-2 font-body font-semibold uppercase tracking-[0.15em]"
        style={{ background: canContinue ? 'var(--color-brand-accent)' : 'rgba(9,32,62,0.18)', color: NAVY, padding: '15px 24px', fontSize: '0.82rem', border: 'none', cursor: canContinue && ! busy ? 'pointer' : 'not-allowed', borderRadius: 4 }}
      >
        {busy ? <><Loader2 size={16} className="animate-spin" /> Saving</> : <>Continue <ArrowRight size={16} /></>}
      </button>
    </div>
  )
}

function MatchmakingStep({ person, company, mm, setMm, busy, onSubmit }) {
  const toggle = (key, v) => setMm({ ...mm, [key]: mm[key].includes(v) ? mm[key].filter((x) => x !== v) : [...mm[key], v] })
  const set = (key) => (v) => setMm({ ...mm, [key]: v })

  const form = INTAKE_FORMS[mm.side]
  const isCapital = mm.side === 'capital'

  // Switching side prunes any ticked signal that the new side's form does not
  // render, so the chips and the eventual payload stay consistent.
  function setSide(side) {
    const next = INTAKE_FORMS[side]
    const lookingValid = new Set((next.lookingFor || []).map(([key]) => key))
    const offerValid = new Set((next.canProvide || []).map(([key]) => key))
    const painValid = new Set([...next.pains, 'other'])
    setMm({
      ...mm,
      side,
      organization_type: '', organization_type_other: '',
      league_level: '', industry_sector: '', aum_range: '',
      looking_for: mm.looking_for.filter((k) => lookingValid.has(k)),
      can_offer: mm.can_offer.filter((k) => offerValid.has(k)),
      pain_points: mm.pain_points.filter((k) => painValid.has(k)),
      deal_types: [], deal_structures: [],
      budget_range: '', budget_other: '',
    })
  }

  const painLabel = (key) => form.painLabels?.[key]
    || PAIN_OPTIONS.find((p) => p.key === key)?.label
    || key

  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: 'clamp(28px,4vw,40px)', boxShadow: '0 30px 80px rgba(0,0,0,0.45)' }}>
      <div className="flex items-center gap-2 mb-4 p-3 rounded-lg" style={{ background: 'rgba(107,58,168,0.08)', border: '1px solid rgba(107,58,168,0.2)' }}>
        <Sparkles size={16} color={PURPLE} />
        <span className="font-body" style={{ fontSize: '0.85rem', color: NAVY }}>
          Applying as <strong>{person?.display_name}</strong> at <strong>{company?.display_name}</strong>
        </span>
      </div>

      <h2 className="font-heading font-bold mb-2" style={{ fontSize: '1.2rem', color: NAVY }}>Deal Network intake</h2>
      <p className="font-body mb-5" style={{ fontSize: '0.9rem', color: '#586778', lineHeight: 1.55 }}>
        A tailored intake for your side of the marketplace. Help us put you in the right rooms.
      </p>

      {/* Side selector — drives which tailored form renders below. */}
      <div className="mb-6">
        <Label>Which best describes you?</Label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'property', title: 'Rightsholder', sub: 'Club, federation, league, venue, agency', accent: NAVY, tintBg: 'rgba(9,32,62,0.07)' },
            { id: 'brand', title: 'Commercial Partner', sub: 'Brand, sponsor, technology, media, agency', accent: PURPLE, tintBg: 'rgba(107,58,168,0.08)' },
            { id: 'capital', title: 'Capital Partner / Nonprofit', sub: 'Investor, fund, family office, foundation', accent: GOLD, tintBg: 'rgba(143,129,54,0.12)' },
          ].map((opt) => {
            const active = mm.side === opt.id
            return (
              <button
                key={opt.id} type="button" onClick={() => setSide(opt.id)}
                style={{ textAlign: 'left', background: active ? opt.tintBg : '#f8f7f4', border: '1.5px solid ' + (active ? opt.accent : 'rgba(9,32,62,0.12)'), borderRadius: 10, padding: '12px 14px', cursor: 'pointer' }}
              >
                <div className="font-heading font-semibold" style={{ fontSize: '0.95rem', color: active ? opt.accent : NAVY }}>{opt.title}</div>
                <div className="font-body" style={{ fontSize: '0.72rem', color: '#7a8896', marginTop: 2, lineHeight: 1.4 }}>{opt.sub}</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── COMPANY INFORMATION ─────────────────────────────────────────── */}
      <SectionHeading>Company information</SectionHeading>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Website" value={mm.website} onChange={set('website')} placeholder="https://yourcompany.com" type="url" disabled={busy} />
        <Field label="Phone / WhatsApp" value={mm.phone} onChange={set('phone')} placeholder="+1 305 555 0100" disabled={busy} />
      </div>
      <div className="mb-4">
        <Label>Will the decision-maker attend Miami?</Label>
        <ChipGroup options={['Yes', 'No', 'TBC']} value={mm.attendance ? [mm.attendance === 'tbc' ? 'TBC' : mm.attendance === 'yes' ? 'Yes' : 'No'] : []}
          onToggle={(label) => {
            const v = label.toLowerCase()
            setMm({ ...mm, attendance: mm.attendance === v ? '' : v })
          }} />
      </div>

      {/* ── ABOUT YOUR ORGANIZATION ─────────────────────────────────────── */}
      <SectionHeading>About your organization</SectionHeading>
      <SelectField
        label={form.orgTypeLabel}
        value={mm.organization_type}
        onChange={set('organization_type')}
        options={[...form.orgTypes, 'Other']}
        disabled={busy}
      />
      {mm.organization_type === 'Other' && (
        <Field label={`${form.orgTypeLabel} (other)`} value={mm.organization_type_other} onChange={set('organization_type_other')} placeholder="Type it in" disabled={busy} />
      )}
      {mm.side === 'property' && (
        <SelectField label="League / competition level" value={mm.league_level} onChange={set('league_level')} options={form.leagueLevels} disabled={busy} />
      )}
      {mm.side === 'brand' && (
        <SelectField label="Industry / sector" value={mm.industry_sector} onChange={set('industry_sector')} options={form.industries} disabled={busy} />
      )}
      {isCapital && (
        <SelectField label="Assets under management / capital deployed (ballpark)" value={mm.aum_range} onChange={set('aum_range')} options={form.aumRanges} disabled={busy} />
      )}
      <SelectField label="Primary geography / market" value={mm.primary_geography} onChange={set('primary_geography')} options={[...INTAKE_REGIONS, 'Other']} disabled={busy} />
      {mm.primary_geography === 'Other' && (
        <Field label="Primary geography (other)" value={mm.primary_geography_other} onChange={set('primary_geography_other')} placeholder="Type it in" disabled={busy} />
      )}

      {/* ── YOUR DEAL / YOUR MANDATE ────────────────────────────────────── */}
      <SectionHeading>{isCapital ? 'Your mandate' : 'Your deal'}</SectionHeading>
      <Field label={form.pitchLabel} value={mm.pitch} onChange={set('pitch')} placeholder={form.pitchPlaceholder} disabled={busy} textarea />

      <div className="mb-4">
        <Label>{form.lookingForLabel || 'What are you looking for? (select all that apply)'}</Label>
        <KeyedChips options={form.lookingFor} value={mm.looking_for} onToggle={(k) => toggle('looking_for', k)} />
        <OtherInline value={mm.looking_other} onChange={set('looking_other')} disabled={busy} />
      </div>

      {form.canProvide && (
        <div className="mb-4">
          <Label>What can you provide? (select all that apply)</Label>
          <KeyedChips options={form.canProvide} value={mm.can_offer} onToggle={(k) => toggle('can_offer', k)} />
          <OtherInline value={mm.offer_other} onChange={set('offer_other')} disabled={busy} />
        </div>
      )}

      <div className="mb-2">
        <Label>What problems are you trying to solve? (select all that apply)</Label>
        <KeyedChips options={[...form.pains.map((k) => [k, painLabel(k)]), ['other', 'Other']]} value={mm.pain_points} onToggle={(k) => toggle('pain_points', k)} />
      </div>
      {mm.pain_points.length > 0 && (
        <Field label="Anything to add on those? (optional)" value={mm.pain_point_detail} onChange={set('pain_point_detail')} placeholder="A sentence or two of context helps the concierge." disabled={busy} textarea />
      )}

      <div className="mb-4">
        <Label>{form.dealTypesLabel || 'Deal types you are open to (select all that apply)'}</Label>
        <ChipGroup options={form.dealTypes} value={mm.deal_types} onToggle={(v) => toggle('deal_types', v)} />
        <OtherInline value={mm.deal_types_other} onChange={set('deal_types_other')} disabled={busy} />
      </div>

      {form.dealStructures && (
        <div className="mb-4">
          <Label>Deal structure preference (select all that apply)</Label>
          <ChipGroup options={form.dealStructures} value={mm.deal_structures} onToggle={(v) => toggle('deal_structures', v)} />
          <OtherInline value={mm.deal_structures_other} onChange={set('deal_structures_other')} disabled={busy} />
        </div>
      )}

      {/* ── COUNTERPART & DEAL PARAMETERS ───────────────────────────────── */}
      <SectionHeading>Counterpart &amp; deal parameters</SectionHeading>
      <Field label={form.counterpartLabel} value={mm.ideal_counterpart} onChange={set('ideal_counterpart')} placeholder={form.counterpartPlaceholder} disabled={busy} textarea />
      <Field label="Named targets (optional — specific clubs, leagues, federations, or companies, one per line)" value={mm.named_targets} onChange={set('named_targets')} placeholder={'Atlanta United\nLA Galaxy\nFC Cincinnati'} disabled={busy} textarea />

      <div className="grid grid-cols-2 gap-3">
        <SelectField label={form.budgetLabel} value={mm.budget_range} onChange={set('budget_range')} options={[...form.budgets, 'Other']} disabled={busy} />
        <Field label="Decision timeline (optional)" value={mm.decision_timeline} onChange={set('decision_timeline')} placeholder="Q3 2026, before Miami, etc." disabled={busy} />
      </div>
      {mm.budget_range === 'Other' && (
        <Field label={`${form.budgetLabel} (other)`} value={mm.budget_other} onChange={set('budget_other')} placeholder="Type it in" disabled={busy} />
      )}

      {isCapital && (
        <>
          <SelectField label="Primary geography of investment interest" value={mm.investment_geography} onChange={set('investment_geography')} options={INTAKE_REGIONS} disabled={busy} />
          <Field label="Leagues or competitions of interest (optional)" value={mm.leagues_interest} onChange={set('leagues_interest')} placeholder="e.g., MLS, Liga MX, Championship, Brasileirão" disabled={busy} />
        </>
      )}

      {/* ── ADDITIONAL CONTEXT ──────────────────────────────────────────── */}
      <SectionHeading>Additional context</SectionHeading>
      <Field
        label="Anything else we should know? (optional)"
        value={mm.additional_context} onChange={set('additional_context')}
        placeholder={isCapital
          ? "Context that doesn't fit above — prior deal attempts, specific constraints, ESG mandates, fund cycle timing, etc."
          : "Context that doesn't fit above — prior deal attempts, specific constraints, preferences, etc."}
        disabled={busy} textarea
      />

      <button
        type="button" onClick={onSubmit} disabled={busy}
        className="w-full mt-4 inline-flex items-center justify-center gap-2 font-body font-semibold uppercase tracking-[0.15em]"
        style={{ background: 'var(--color-brand-accent)', color: NAVY, padding: '15px 24px', fontSize: '0.82rem', border: 'none', cursor: busy ? 'wait' : 'pointer', borderRadius: 4 }}
      >
        {busy ? <><Loader2 size={16} className="animate-spin" /> Submitting</> : <>Submit application <ArrowRight size={16} /></>}
      </button>
    </div>
  )
}

function SectionHeading({ children }) {
  return (
    <div className="font-mono uppercase tracking-[0.18em]" style={{
      fontSize: '0.64rem', color: 'var(--color-brand-accent)', fontWeight: 700,
      borderTop: '1px solid rgba(9,32,62,0.08)', paddingTop: 18, marginTop: 22, marginBottom: 14,
    }}>{children}</div>
  )
}

function SelectField({ label, value, onChange, options, disabled }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <Label>{label}</Label>
      <select value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled}
        style={{ width: '100%', padding: '10px 12px', fontSize: '0.9rem', background: '#f8f7f4', border: '1px solid rgba(9,32,62,0.12)', borderRadius: 6, color: NAVY }}>
        <option value="">Choose one</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

/* Chips whose VALUES are taxonomy keys but whose labels vary per side. */
function KeyedChips({ options, value, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(([key, label]) => {
        const active = value.includes(key)
        return (
          <button key={key} type="button" onClick={() => onToggle(key)}
            style={{ background: active ? NAVY : '#f8f7f4', color: active ? '#fff' : NAVY, border: '1px solid ' + (active ? NAVY : 'rgba(9,32,62,0.12)'), borderRadius: 999, padding: '6px 12px', fontSize: '0.78rem', cursor: 'pointer' }}>
            {label}
          </button>
        )
      })}
    </div>
  )
}

/* Small free-text "Other (type in)" companion below a chip group. */
function OtherInline({ value, onChange, disabled }) {
  return (
    <input
      type="text" value={value} disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Other (type in)"
      style={{ width: '100%', marginTop: 8, padding: '8px 12px', fontSize: '0.85rem', background: '#fcfbf9', border: '1px dashed rgba(9,32,62,0.18)', borderRadius: 6, color: NAVY, outline: 'none' }}
    />
  )
}

function DoneStep({ person, email, testMode }) {
  const [portalRequested, setPortalRequested] = useState(false)
  const [portalBusy, setPortalBusy] = useState(false)

  async function requestPortalLink() {
    if (! email || portalBusy) return
    setPortalBusy(true)
    try {
      const { requestProfileAccess } = await import('../lib/soccerexApi')
      await requestProfileAccess({ email }, { test: testMode })
      setPortalRequested(true)
    } catch { setPortalRequested(true) /* response is intentionally identical either way */ } finally {
      setPortalBusy(false)
    }
  }

  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: 'clamp(28px,4vw,40px)', boxShadow: '0 30px 80px rgba(0,0,0,0.45)', textAlign: 'center' }}>
      <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-brand-accent), #d4c78e)', display: 'grid', placeItems: 'center', margin: '0 auto 20px', boxShadow: '0 20px 60px rgba(191,177,112,0.45)' }}>
        <CheckCircle2 size={36} color={NAVY} />
      </div>
      <h2 className="font-heading font-bold mb-3" style={{ fontSize: '1.6rem', color: NAVY }}>You're in</h2>
      <p className="font-body mb-2" style={{ fontSize: '1rem', color: '#586778', lineHeight: 1.6 }}>
        Thanks <strong>{person?.display_name}</strong>. The Soccerex team will review your application and reach out with proposed introductions.
      </p>
      <p className="font-body" style={{ fontSize: '0.85rem', color: '#9aa6b3' }}>
        Expect to hear back within two business days.
      </p>

      {/* Profile continuity: the application lives on their Soccerex profile —
          hand them the door to it instead of a dead end. */}
      <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(9,32,62,0.08)', textAlign: 'left' }}>
        <p className="font-mono uppercase tracking-[0.16em]" style={{ fontSize: '0.62rem', color: PURPLE, fontWeight: 700, marginBottom: 6 }}>Your Soccerex profile</p>
        <p className="font-body" style={{ fontSize: '0.9rem', color: '#586778', lineHeight: 1.6, marginBottom: 12 }}>
          This application is saved to <strong>{person?.display_name}</strong>'s Soccerex profile. Your portal keeps everything in one place — Deal Network requests and meetings, event access, speaking, and your profile details.
        </p>
        {portalRequested ? (
          <p className="font-body" style={{ fontSize: '0.88rem', color: '#166534' }}>
            ✓ Check your inbox — we emailed you a secure link to your Soccerex portal.
          </p>
        ) : (
          <button type="button" onClick={requestPortalLink} disabled={portalBusy}
            className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.12em]"
            style={{ background: NAVY, color: '#fff', padding: '11px 18px', fontSize: '0.72rem', border: 'none', borderRadius: 6, cursor: portalBusy ? 'wait' : 'pointer' }}>
            {portalBusy ? <><Loader2 size={14} className="animate-spin" /> Sending</> : <>Open my Soccerex portal <ArrowRight size={14} /></>}
          </button>
        )}
      </div>
    </div>
  )
}

function Field({ label, value, onChange, placeholder, type = 'text', required, textarea, disabled }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label className="block font-mono uppercase tracking-[0.1em]" style={{ fontSize: '0.66rem', color: NAVY, fontWeight: 600, marginBottom: 6 }}>
        {label}{required && <span style={{ color: 'var(--color-brand-accent)', marginLeft: 4 }}>*</span>}
      </label>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} disabled={disabled} rows={3}
          style={{ width: '100%', padding: '10px 12px', fontSize: '0.9rem', background: '#f8f7f4', border: '1px solid rgba(9,32,62,0.12)', borderRadius: 6, color: NAVY, outline: 'none', resize: 'vertical' }} />
      ) : (
        <input type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} disabled={disabled}
          style={{ width: '100%', padding: '10px 12px', fontSize: '0.9rem', background: '#f8f7f4', border: '1px solid rgba(9,32,62,0.12)', borderRadius: 6, color: NAVY, outline: 'none' }} />
      )}
    </div>
  )
}

function Label({ children }) {
  return (
    <label className="block font-mono uppercase tracking-[0.1em] mb-2" style={{ fontSize: '0.66rem', color: NAVY, fontWeight: 600 }}>{children}</label>
  )
}

function ChipGroup({ options, value, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = value.includes(o)
        return (
          <button key={o} type="button" onClick={() => onToggle(o)}
            style={{ background: active ? NAVY : '#f8f7f4', color: active ? '#fff' : NAVY, border: '1px solid ' + (active ? NAVY : 'rgba(9,32,62,0.12)'), borderRadius: 999, padding: '6px 12px', fontSize: '0.78rem', cursor: 'pointer' }}>
            {o}
          </button>
        )
      })}
    </div>
  )
}
