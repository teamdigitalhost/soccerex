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
import { CAPABILITY_VALIDITY, NEED_OFFER_LABELS, PAIN_OPTIONS } from '../lib/dealNetworkTaxonomy'
import { isTestModeFromUrl } from '../lib/testMode'

// company Profile type → applicant side. club/federation are rightsholders
// (Property side); everything else is treated as a company (Brand side).
// Mirrors the backend mapping the apply flow already uses.
function deriveSide(company) {
  const t = company?.type
  return t === 'club' || t === 'federation' ? 'property' : 'brand'
}
// Property = rightsholder, Brand = company — the values submitIntake expects.
const SIDE_TO_BACKEND = { property: 'rightsholder', brand: 'company' }

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

  // Matchmaking
  const [matchmakingToken, setMatchmakingToken] = useState('')
  const [mm, setMm] = useState({
    side: 'brand',
    looking_for: [], can_offer: [], deal_types: [],
    pain_points: [], pain_point_detail: '',
    one_sentence_pitch: '', deal_description: '',
    ideal_counterpart: '', budget_range: '',
    primary_geography: '', decision_timeline: '',
    named_targets: '',
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
      setMm((prev) => ({ ...prev, side: deriveSide(res.company) }))
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
      // Only emit signals valid for the chosen side, so a stale tick from a
      // pre-switch selection can never reach the backend's key validation.
      const validFor = (col) => CAPABILITY_VALIDITY
        .filter((row) => row[mm.side]?.[col])
        .map((row) => row.key)
      const lookingValid = new Set(validFor('looking'))
      const offerValid = new Set(validFor('provide'))

      await submitDealNetworkIntake({
        side: SIDE_TO_BACKEND[mm.side],
        company_name: chosenCompany?.display_name || companyName,
        primary_contact_name: chosenPerson?.display_name || personName,
        primary_contact_email: email || matched?.email,
        primary_contact_title: personTitle,
        deal_types: mm.deal_types,
        one_sentence_pitch: mm.one_sentence_pitch || undefined,
        deal_description: mm.deal_description || undefined,
        ideal_counterpart: mm.ideal_counterpart || undefined,
        named_targets: mm.named_targets.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean),
        looking_for: mm.looking_for.filter((k) => lookingValid.has(k)),
        can_offer: mm.can_offer.filter((k) => offerValid.has(k)),
        pain_points: mm.pain_points,
        pain_point_detail: mm.pain_point_detail || undefined,
        budget_range: mm.budget_range || undefined,
        primary_geography: mm.primary_geography || undefined,
        decision_timeline: mm.decision_timeline || undefined,
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
          {step === STEP_DONE && <DoneStep person={chosenPerson} company={chosenCompany} />}
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

  const DEAL_TYPES = ['Sponsorship', 'Media rights', 'Content partnership', 'Technology / platform', 'Hospitality / experiences', 'Investment / M&A', 'Stadium / venue', 'Data / analytics', 'Merchandising / licensing']
  const BUDGETS = ['Under $25k', '$25k - $50k', '$50k - $100k', '$100k - $250k', '$250k - $500k', '$500k - $1M', '$1M+', 'Prefer not to say']
  const REGIONS = ['Global', 'Americas', 'Europe', 'MENA / GCC', 'Africa', 'Asia', 'Oceania']

  // Switching side prunes any ticked signal that is not valid for the new side,
  // so the grid and the eventual payload stay consistent with the chosen side.
  function setSide(side) {
    const lookingValid = new Set(CAPABILITY_VALIDITY.filter((r) => r[side]?.looking).map((r) => r.key))
    const offerValid = new Set(CAPABILITY_VALIDITY.filter((r) => r[side]?.provide).map((r) => r.key))
    setMm({
      ...mm,
      side,
      looking_for: mm.looking_for.filter((k) => lookingValid.has(k)),
      can_offer: mm.can_offer.filter((k) => offerValid.has(k)),
    })
  }

  const rows = CAPABILITY_VALIDITY.filter((r) => r[mm.side]?.looking || r[mm.side]?.provide)

  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: 'clamp(28px,4vw,40px)', boxShadow: '0 30px 80px rgba(0,0,0,0.45)' }}>
      <div className="flex items-center gap-2 mb-4 p-3 rounded-lg" style={{ background: 'rgba(107,58,168,0.08)', border: '1px solid rgba(107,58,168,0.2)' }}>
        <Sparkles size={16} color={PURPLE} />
        <span className="font-body" style={{ fontSize: '0.85rem', color: NAVY }}>
          Applying as <strong>{person?.display_name}</strong> at <strong>{company?.display_name}</strong>
        </span>
      </div>

      <h2 className="font-heading font-bold mb-2" style={{ fontSize: '1.2rem', color: NAVY }}>Deal-network questions</h2>
      <p className="font-body mb-5" style={{ fontSize: '0.9rem', color: '#586778', lineHeight: 1.55 }}>
        Help us put you in the right rooms.
      </p>

      {/* Which side are you? Drives the grid columns and the membership side
          sent to the backend. Pre-selected from the claimed company's type,
          but confirmable here so a defaulted side (e.g. a free-email signup
          that lands on Brand) can be corrected before the grid renders. */}
      <div className="mb-5">
        <Label>Which best describes you?</Label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'property', title: 'Property', sub: 'Rightsholder — club, federation, league, venue' },
            { id: 'brand', title: 'Brand / Company', sub: 'Sponsor, investor, agency, technology, media' },
          ].map((opt) => {
            const active = mm.side === opt.id
            return (
              <button
                key={opt.id} type="button" onClick={() => setSide(opt.id)}
                style={{ textAlign: 'left', background: active ? 'rgba(107,58,168,0.08)' : '#f8f7f4', border: '1.5px solid ' + (active ? PURPLE : 'rgba(9,32,62,0.12)'), borderRadius: 10, padding: '12px 14px', cursor: 'pointer' }}
              >
                <div className="font-heading font-semibold" style={{ fontSize: '0.95rem', color: active ? PURPLE : NAVY }}>{opt.title}</div>
                <div className="font-body" style={{ fontSize: '0.72rem', color: '#7a8896', marginTop: 2, lineHeight: 1.4 }}>{opt.sub}</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Type-aware capability grid. Each row offers up to two checkboxes;
          a cell renders only where it makes sense for the chosen side. */}
      <div className="mb-5">
        <Label>What are you looking for, and what can you provide?</Label>
        <CapabilityGrid
          rows={rows} side={mm.side}
          looking={mm.looking_for} offer={mm.can_offer}
          onToggle={(col, key) => toggle(col === 'looking' ? 'looking_for' : 'can_offer', key)}
        />
      </div>

      <Field
        label="One-sentence pitch (what do you want to do in football)"
        value={mm.one_sentence_pitch}
        onChange={(v) => setMm({ ...mm, one_sentence_pitch: v })}
        placeholder="e.g. We want to launch a fan-data activation with two MLS clubs in 2026."
        disabled={busy}
      />

      {/* Pain points — secondary context for the concierge, kept optional.
          Distinct from the need/offer grid (which drives matching). */}
      <div className="mb-2">
        <Label>What problems are you trying to solve? (optional)</Label>
        <ChipGroup options={PAIN_OPTIONS.map((p) => p.label)} value={mm.pain_points.map((k) => PAIN_OPTIONS.find((p) => p.key === k)?.label).filter(Boolean)}
          onToggle={(label) => {
            const key = PAIN_OPTIONS.find((p) => p.label === label)?.key
            if (key) toggle('pain_points', key)
          }} />
      </div>
      {mm.pain_points.length > 0 && (
        <Field label="Anything to add on those? (optional)" value={mm.pain_point_detail} onChange={(v) => setMm({ ...mm, pain_point_detail: v })} placeholder="A sentence or two of context helps the concierge." disabled={busy} textarea />
      )}

      <div className="mb-4">
        <Label>Deal types you are open to</Label>
        <ChipGroup options={DEAL_TYPES} value={mm.deal_types} onToggle={(v) => toggle('deal_types', v)} />
      </div>

      <Field label="Ideal counterpart (the kind of company / role)" value={mm.ideal_counterpart} onChange={(v) => setMm({ ...mm, ideal_counterpart: v })} placeholder="Mid-major MLS club head of partnerships" disabled={busy} textarea />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Primary geography</Label>
          <select value={mm.primary_geography} onChange={(e) => setMm({ ...mm, primary_geography: e.target.value })} className="portal-input" style={{ width: '100%', padding: '10px 12px', fontSize: '0.9rem', background: '#f8f7f4', border: '1px solid rgba(9,32,62,0.12)', borderRadius: 6 }}>
            <option value="">Pick one</option>
            {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <Label>Budget range</Label>
          <select value={mm.budget_range} onChange={(e) => setMm({ ...mm, budget_range: e.target.value })} style={{ width: '100%', padding: '10px 12px', fontSize: '0.9rem', background: '#f8f7f4', border: '1px solid rgba(9,32,62,0.12)', borderRadius: 6 }}>
            <option value="">Pick one</option>
            {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
      </div>

      <Field label="Named targets (optional, one per line)" value={mm.named_targets} onChange={(v) => setMm({ ...mm, named_targets: v })} placeholder="Atlanta United\nLA Galaxy\nFC Cincinnati" disabled={busy} textarea />

      <Field label="Decision timeline (optional)" value={mm.decision_timeline} onChange={(v) => setMm({ ...mm, decision_timeline: v })} placeholder="Q3 2026, before Miami, etc." disabled={busy} />

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

function CapabilityGrid({ rows, side, looking, offer, onToggle }) {
  return (
    <div style={{ border: '1px solid rgba(9,32,62,0.1)', borderRadius: 10, overflow: 'hidden' }}>
      <div className="grid items-center" style={{ gridTemplateColumns: '1fr 72px 72px', background: '#f8f7f4', borderBottom: '1px solid rgba(9,32,62,0.08)' }}>
        <span />
        <span className="font-mono uppercase tracking-[0.1em] text-center" style={{ fontSize: '0.56rem', color: '#7a8896', fontWeight: 700, padding: '8px 4px' }}>Looking<br />for</span>
        <span className="font-mono uppercase tracking-[0.1em] text-center" style={{ fontSize: '0.56rem', color: '#7a8896', fontWeight: 700, padding: '8px 4px' }}>Can<br />provide</span>
      </div>
      {rows.map((row, i) => (
        <div key={row.key} className="grid items-center" style={{ gridTemplateColumns: '1fr 72px 72px', borderTop: i === 0 ? 'none' : '1px solid rgba(9,32,62,0.06)' }}>
          <span className="font-body" style={{ fontSize: '0.82rem', color: NAVY, padding: '10px 12px', lineHeight: 1.25 }}>{NEED_OFFER_LABELS[row.key]}</span>
          <GridCell visible={!! row[side]?.looking} checked={looking.includes(row.key)} onClick={() => onToggle('looking', row.key)} />
          <GridCell visible={!! row[side]?.provide} checked={offer.includes(row.key)} onClick={() => onToggle('provide', row.key)} />
        </div>
      ))}
    </div>
  )
}

function GridCell({ visible, checked, onClick }) {
  if (! visible) return <span style={{ display: 'grid', placeItems: 'center', color: 'rgba(9,32,62,0.18)', fontSize: '0.9rem' }}>·</span>
  return (
    <span style={{ display: 'grid', placeItems: 'center', padding: '8px 0' }}>
      <button type="button" role="checkbox" aria-checked={checked} onClick={onClick}
        style={{ width: 26, height: 26, borderRadius: 6, border: '1.5px solid ' + (checked ? PURPLE : 'rgba(9,32,62,0.25)'), background: checked ? PURPLE : '#fff', color: '#fff', display: 'grid', placeItems: 'center', cursor: 'pointer', padding: 0 }}>
        {checked && <CheckCircle2 size={16} />}
      </button>
    </span>
  )
}

function DoneStep({ person, company }) {
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
