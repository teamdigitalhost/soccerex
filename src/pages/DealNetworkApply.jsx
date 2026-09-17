import { useEffect, useId, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowRight, Loader2, Mail, CheckCircle2, AlertTriangle, Building2, User as UserIcon, Search, ChevronRight, Lock, Sparkles } from 'lucide-react'
import {
  dealNetworkApplyStart,
  dealNetworkApplyStartAssisted,
  dealNetworkApplyStartUnverified,
  dealNetworkApplyPreview,
  dealNetworkSearchCompanies,
  dealNetworkApplyClaim,
  submitDealNetworkIntake,
  ApiError,
} from '../lib/soccerexApi'
import { RITZ_DRAWING } from '../lib/routes'
import { INTAKE_FORMS, INTAKE_REGIONS, PAIN_OPTIONS } from '../lib/dealNetworkTaxonomy'
import { parseNamedTargets, namedTargetsProblem } from '../lib/namedTargets'
import { isTestModeFromUrl } from '../lib/testMode'
import { readCampaignAttribution, clearCampaignAttribution } from '../lib/campaignAttribution'
import { describeError } from '../lib/smartError'

// company Profile type → applicant side. club/federation are rightsholders
// (Property side); everything else is treated as a company (Brand side).
// Mirrors the backend mapping the apply flow already uses.
function deriveSide(company) {
  const t = company?.type
  return t === 'club' || t === 'federation' ? 'property' : 'brand'
}
// Property = rightsholder, Brand = company, Capital = capital: the values
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
 * The page is deliberately not linked from the main /deal-network; it is
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

const EMPTY_ATTRIBUTION = { sx: '', track: '' }

const BACKEND_TO_SIDE = { rightsholder: 'property', property: 'property', company: 'brand', brand: 'brand', capital: 'capital' }

function emptyMatchmaking(side) {
  return {
    side,
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
  }
}

/**
 * Turns the company's latest intake (claim response `existing_intake`, keyed like
 * the submitIntake payload) back into the form's own state, so a returning company
 * or a white-glove call starts from what we already know. Values the current form
 * cannot show as an option land in that question's "Other" box rather than being
 * dropped, and signal keys the side does not ask about are left out, the same
 * pruning a side switch does.
 */
function matchmakingFromIntake(intake, fallbackSide) {
  const side = BACKEND_TO_SIDE[intake?.side] || fallbackSide
  const form = INTAKE_FORMS[side]
  const mm = emptyMatchmaking(side)
  if (! intake || typeof intake !== 'object' || ! form) return mm

  const text = (v) => (typeof v === 'string' ? v : (v == null ? '' : String(v)))
  const list = (v) => (Array.isArray(v) ? v.map(text).map((s) => s.trim()).filter(Boolean) : (text(v).trim() ? [text(v).trim()] : []))
  const pickOrOther = (value, options) => {
    const v = text(value).trim()
    if (! v) return ['', '']
    return options.includes(v) ? [v, ''] : ['Other', v]
  }
  const pickKnown = (value, options) => (options?.includes(text(value).trim()) ? text(value).trim() : '')
  const splitKnown = (values, options) => {
    const all = list(values)
    return [all.filter((v) => options.includes(v)), all.filter((v) => ! options.includes(v)).join(', ')]
  }
  const keys = (pairs) => new Set((pairs || []).map(([key]) => key))

  mm.website = text(intake.website)
  mm.phone = text(intake.primary_contact_phone)
  const attendance = text(intake.decision_maker_attendance).toLowerCase()
  mm.attendance = ['yes', 'no', 'tbc'].includes(attendance) ? attendance : ''

  ;[mm.organization_type, mm.organization_type_other] = pickOrOther(intake.organization_type, form.orgTypes)
  mm.league_level = side === 'property' ? pickKnown(intake.league_level, form.leagueLevels) : ''
  mm.industry_sector = side === 'brand' ? pickKnown(intake.industry_sector, form.industries) : ''
  mm.aum_range = side === 'capital' ? pickKnown(intake.aum_range, form.aumRanges) : ''
  ;[mm.primary_geography, mm.primary_geography_other] = pickOrOther(intake.primary_geography, INTAKE_REGIONS)

  mm.pitch = text(intake.deal_description).trim() || text(intake.one_sentence_pitch).trim()

  const lookingValid = keys(form.lookingFor)
  const offerValid = keys(form.canProvide)
  const painValid = new Set([...form.pains, 'other'])
  mm.looking_for = list(intake.looking_for).filter((k) => lookingValid.has(k))
  mm.looking_other = text(intake.looking_for_other)
  mm.can_offer = list(intake.can_offer).filter((k) => offerValid.has(k))
  mm.offer_other = text(intake.can_offer_other)
  mm.pain_points = list(intake.pain_points).filter((k) => painValid.has(k))
  mm.pain_point_detail = text(intake.pain_point_detail)

  ;[mm.deal_types, mm.deal_types_other] = splitKnown(intake.deal_types, form.dealTypes)
  if (form.dealStructures) {
    ;[mm.deal_structures, mm.deal_structures_other] = splitKnown(intake.deal_structure_preferences, form.dealStructures)
  }

  mm.ideal_counterpart = text(intake.ideal_counterpart)
  mm.named_targets = list(intake.named_targets).join('\n')
  ;[mm.budget_range, mm.budget_other] = pickOrOther(intake.budget_range, form.budgets)
  if (side === 'capital') {
    mm.investment_geography = pickKnown(intake.investment_geography, INTAKE_REGIONS)
    mm.leagues_interest = list(intake.leagues_competitions).join(', ')
  }
  mm.decision_timeline = text(intake.decision_timeline)
  mm.additional_context = text(intake.additional_context)

  return mm
}

/* Layout for this page lives here rather than inline, because the fixes need
   container queries: the card is at most ~560px wide at every viewport, so
   what decides whether two fields fit side by side is the card, not the
   window. Class names are prefixed so nothing else on the site can collide. */
const APPLY_CSS = `
.dna-card { background:#fff; border-radius:16px; padding:clamp(20px,4.5vw,36px); box-shadow:0 30px 80px rgba(0,0,0,0.45); container-type:inline-size; min-width:0; }
.dna-card * { min-width:0; }
.dna-card, .dna-card p, .dna-card label, .dna-card button, .dna-card span, .dna-card div { overflow-wrap:anywhere; }
.dna-card input, .dna-card select, .dna-card textarea { max-width:100%; box-sizing:border-box; text-overflow:ellipsis; }
.dna-row2 { display:grid; grid-template-columns:minmax(0,1fr); column-gap:12px; }
@container (min-width: 460px) { .dna-row2 { grid-template-columns:repeat(2,minmax(0,1fr)); } }
.dna-sides { display:grid; grid-template-columns:minmax(0,1fr); gap:8px; }
.dna-btn { display:inline-flex; align-items:center; justify-content:center; gap:8px; text-align:center; white-space:normal; line-height:1.3; }
.dna-btn svg { flex-shrink:0; }
.dna-nav { display:flex; align-items:stretch; gap:10px; margin-top:24px; }
.dna-nav > .dna-next { flex:1 1 0; }
.dna-nav > .dna-back { flex:0 0 auto; }
.dna-match { display:flex; flex-wrap:wrap; align-items:flex-start; column-gap:12px; row-gap:4px; }
.dna-match-body { flex:1 1 170px; }
.dna-match-reject { flex:0 0 auto; margin-left:auto; }
.dna-actions { display:grid; grid-template-columns:minmax(0,1fr); gap:10px; }
@container (min-width: 400px) { .dna-actions { grid-template-columns:repeat(2,minmax(0,1fr)); } }
.dna-progress-head { display:flex; flex-wrap:wrap; align-items:baseline; justify-content:space-between; column-gap:12px; row-gap:2px; }
`

/* One type scale for everything inside the card. The card is narrow, so the
   sizes are set for it: step title, then body copy, then the field labels and
   small print, and inputs at 16px or more so phones do not zoom on focus. */
const T = {
  title: '1.6rem',
  lead: '1.125rem',
  body: '1.0625rem',
  input: '1.0625rem',
  chip: '0.9375rem',
  label: '0.8125rem',
  button: '0.9375rem',
  small: '0.875rem',
}

function normalizeApplyEmail(value) {
  return String(value || '').trim().replace(/[.,;:]+$/g, '').toLowerCase()
}

export default function DealNetworkApply() {
  const [params] = useSearchParams()
  const tokenFromUrl = params.get('token') || ''
  const testMode = isTestModeFromUrl()

  /* White-glove mode. Soccerex keeps one bookmarked link carrying this key and
     opens it when a partner is on the phone: the form is the applicant's own,
     with the email step answered on their behalf instead of mailed to them.
     The key only ever lives in that URL, never in this bundle, and the server
     is what decides whether it is good. */
  const staffKey = params.get('staff') || ''

  /* Campaign attribution from the invite CTA (?track=<cohort>&sx=<click token>), read ONCE on
     mount and then held. Two reasons it cannot be re-read per render: this flow re-renders on
     every keystroke of a long multi-step form, and the URL stops carrying the values the moment
     the applicant clicks the emailed magic link (that lands on ?token=... alone). Reading once
     and holding, with a persisted copy behind it, is what keeps a signup credited to the cohort
     and the email that produced it. Every API call below passes it, and a successful submit
     clears it.

     Held in a ref rather than state on purpose. Clearing it is a bookkeeping act, not a visual
     one: as state it would re-render, and the preview effect below would re-run and re-fetch
     with a magic-link token that has since been consumed, putting an error on the finished
     screen. A ref also keeps the value out of every dependency array in this component. */
  const attributionRef = useRef(undefined)
  if (attributionRef.current === undefined) attributionRef.current = readCampaignAttribution(params)

  // C3: optional ?track= presets the entry side so a tracked link (e.g. from a
  // "Rightsholders" or "Capital & Impact" CTA) lands the applicant on the right
  // capability grid by default. They can still change it via the side selector.
  // Reading it from the held attribution also means the preset survives the
  // magic-link hop, where the URL no longer carries ?track= at all. Frozen at mount so
  // clearing the attribution on submit cannot retroactively change what was shown.
  const [trackParam] = useState(() => attributionRef.current.track)
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

  /* White-glove only: colleagues the caller names during the application. One
     box, commas or new lines, because somebody on a phone should not be made to
     click "add another" four times. Sent as alternate addresses on the person,
     which is what the portal and the access links already read. */
  const [extraEmails, setExtraEmails] = useState('')

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
  /** idle | short | searching | found | empty | error: drives what the picker says. */
  const [companySearch, setCompanySearch] = useState('idle')

  // Matchmaking: tailored per-side intake (2026-06 intake forms doc)
  const [matchmakingToken, setMatchmakingToken] = useState('')
  const [mm, setMm] = useState(() => emptyMatchmaking(trackSide || 'brand'))
  // True when the matchmaking answers opened from the company's previous intake.
  const [prefilled, setPrefilled] = useState(false)

  /* False only after "Continue without confirming": the applicant could not get
     the confirmation email through their company's mail filter. The server keeps
     that token from revealing any existing profile, and review sees the flag. */
  const [emailVerified, setEmailVerified] = useState(true)

  // Load preview when arriving with a token
  useEffect(() => {
    if (! tokenFromUrl) return
    let canceled = false
    setBusy(true)
    dealNetworkApplyPreview(tokenFromUrl, { test: testMode, attribution: attributionRef.current })
      .then((res) => {
        if (canceled) return
        setMatched(res)
        setEmailVerified(res?.email_verified !== false)
        setChosenPerson(res.person)
        setChosenCompany(res.company)
        if (! res.has_matches) {
          setStep(STEP_CONDENSED)
        } else {
          setStep(STEP_PREVIEW)
        }
      })
      .catch((err) => {
        if (canceled) return
        setError(describeError(err, 'This link is invalid or expired.'))
        setStep(STEP_EMAIL)
        setToken('')
      })
      .finally(() => !canceled && setBusy(false))
    return () => { canceled = true }
    /* attributionRef is a ref, so it is deliberately not a dependency: the preview must re-run
       for a new magic-link token, never because the attribution was cleared. */
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
      /* White-glove: Soccerex is on a call with the partner, typing for them.
         There is no inbox to check, so the server hands back the token the
         email would have carried and the form opens on the next step. */
      if (staffKey) {
        const started = await dealNetworkApplyStartAssisted(normalizedEmail, staffKey, { test: testMode })
        setToken(started.token)
        const res = await dealNetworkApplyPreview(started.token, { test: testMode, attribution: attributionRef.current })
        setMatched(res)
        setEmailVerified(res?.email_verified !== false)
        setChosenPerson(res.person)
        setChosenCompany(res.company)
        setStep(res.has_matches ? STEP_PREVIEW : STEP_CONDENSED)

        return
      }

      const res = await dealNetworkApplyStart(normalizedEmail, { test: testMode, attribution: attributionRef.current })
      setSentMessage(res?.message || 'Check your inbox for a confirmation link.')
      setDebugMagicLink(res?.debug?.deal_network_apply_url || '')
      setStep(STEP_SENT)
    } catch (err) {
      setError(describeError(err, 'Could not send confirmation link.'))
    } finally {
      setBusy(false)
    }
  }

  /** "Send it again" on the check-your-email step. Resolves true when it went out. */
  async function handleResend() {
    const normalizedEmail = normalizeApplyEmail(email)
    if (! normalizedEmail) return false
    setError('')
    try {
      const res = await dealNetworkApplyStart(normalizedEmail, { test: testMode, attribution: attributionRef.current })
      if (res?.message) setSentMessage(res.message)
      setDebugMagicLink(res?.debug?.deal_network_apply_url || '')

      return true
    } catch (err) {
      setError(describeError(err, 'Could not send the confirmation link again.'))

      return false
    }
  }

  /**
   * "Continue without confirming": for a company mail filter that holds our email.
   * The server only allows it for an address that asked for a link in the last
   * day, and the token it returns never shows existing profile data, so the
   * applicant lands on the details step and types their own. Review sees the
   * address as unconfirmed until the emailed link is clicked.
   */
  async function handleContinueUnverified() {
    const normalizedEmail = normalizeApplyEmail(email)
    if (! normalizedEmail || busy) return
    setBusy(true); setError('')
    try {
      const started = await dealNetworkApplyStartUnverified(normalizedEmail, { test: testMode, attribution: attributionRef.current })
      setToken(started.token)
      const res = await dealNetworkApplyPreview(started.token, { test: testMode, attribution: attributionRef.current })
      setMatched(res)
      setEmailVerified(false)
      /* Whatever the preview says, an unverified token starts from blank details. */
      setChosenPerson(null)
      setChosenCompany(null)
      setStep(STEP_CONDENSED)
    } catch (err) {
      setError(describeError(err, 'Could not continue without confirming. Please try again.'))
    } finally {
      setBusy(false)
    }
  }

  /**
   * Company lookup for the picker.
   *
   * Reports the OUTCOME, not just the results. Swallowing the failure made a
   * dead search, a search that found nothing, and a search that errored all look
   * identical: a box that does nothing when you type in it.
   */
  async function searchCompanies(q) {
    setCompanyQuery(q)
    const term = q.trim()

    if (term.length < 2) {
      setCompanyResults([])
      setCompanySearch(term === '' ? 'idle' : 'short')

      return
    }
    if (! token) {
      setCompanyResults([])
      setCompanySearch('error')

      return
    }

    setCompanySearch('searching')
    try {
      const res = await dealNetworkSearchCompanies(token, term, { test: testMode })
      const list = Array.isArray(res) ? res : []
      setCompanyResults(list)
      setCompanySearch(list.length > 0 ? 'found' : 'empty')
    } catch {
      setCompanyResults([])
      setCompanySearch('error')
    }
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

      const alsoOn = extraEmails
        .split(/[\s,;]+/)
        .map((address) => address.trim().toLowerCase())
        .filter((address) => address.includes('@'))
      if (alsoOn.length > 0) payload.additional_emails = alsoOn

      const res = await dealNetworkApplyClaim(payload, { test: testMode, attribution: attributionRef.current })
      setMatchmakingToken(res.matchmaking_token)
      setChosenPerson(res.person)
      setChosenCompany(res.company)
      // Track param wins over the company-type guess (lets a rightsholder who
      // came in on a free-email address land on the property grid).
      const guessedSide = trackSide || deriveSide(res.company)
      /* The server only sends existing_intake when prefill is safe (white-glove,
         or a confirmed address whose company is clearly theirs); the local flag is
         a second guard so an unconfirmed session never shows it. */
      const claimVerified = emailVerified && res?.email_verified !== false
      if (! claimVerified) setEmailVerified(false)
      const existing = claimVerified && res?.existing_intake && typeof res.existing_intake === 'object'
        ? res.existing_intake
        : null
      if (existing) {
        /* The company has applied before (or Soccerex is on a call with them):
           open on their latest answers, every one of them still editable. */
        setMm(matchmakingFromIntake(existing, guessedSide))
        if (! personTitle.trim() && typeof existing.primary_contact_title === 'string') setPersonTitle(existing.primary_contact_title)
        setPrefilled(true)
      } else {
        setMm((prev) => ({ ...prev, side: guessedSide }))
        setPrefilled(false)
      }
      setStep(STEP_MATCHMAKING)
    } catch (err) {
      setError(describeError(err, 'Could not save your profile.'))
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
      // Splits the one-line leagues input ("MLS, Liga MX, Championship"), where commas are
      // the separator. Named targets split on new lines only: see lib/namedTargets.
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
        named_targets: parseNamedTargets(mm.named_targets),
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
      }, { test: testMode, attribution: attributionRef.current })
      /* Conversion recorded. Forget the click: this application is over, and a token left behind
         would credit whoever uses this browser next to someone else's click. Only after a
         SUCCESSFUL submit, so a failed attempt the applicant retries keeps its attribution. */
      clearCampaignAttribution()
      attributionRef.current = EMPTY_ATTRIBUTION
      setStep(STEP_DONE)
    } catch (err) {
      setError(describeError(err, 'Could not submit your application.'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ background: NAVY_DEEP, minHeight: '100vh' }}>
      <style>{APPLY_CSS}</style>
      <section className="relative overflow-hidden flex items-center justify-center" style={{ minHeight: '100vh' }}>
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at top, #0d2b52 0%, ${NAVY_DEEP} 70%)` }} />
        <div className="absolute pointer-events-none" style={{ top: '10%', left: '50%', transform: 'translateX(-50%)', width: '900px', height: '900px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(191,177,112,0.10) 0%, transparent 60%)' }} />

        {/* 680 rather than 640 gives the card room for two fields side by side on
            desktop; the container queries stack them whenever it does not fit. */}
        <div className="relative z-10 w-full" style={{ maxWidth: 680, minWidth: 0, padding: 'clamp(40px,6vw,80px) clamp(16px,4vw,40px)', paddingTop: 'max(clamp(40px,6vw,80px), calc(var(--app-top-offset, 72px) + 20px))' }}>
          <div className="flex justify-center mb-6">
            <img src="/brand/crests/crest-main-white.svg" alt="Soccerex" style={{ height: 56 }} />
          </div>
          <h1 className="font-heading font-bold text-white text-center mb-6" style={{ fontSize: 'clamp(1.6rem, 3vw, 2rem)', lineHeight: 1.2, overflowWrap: 'anywhere' }}>
            Apply to join the Soccerex Deal Network
          </h1>

          {error && <SmartErrorBanner error={error} />}

          {step === STEP_EMAIL && <EmailStep email={email} setEmail={setEmail} busy={busy} onSubmit={handleEmailSubmit} staffMode={!! staffKey} />}
          {step === STEP_SENT && (
            <SentStep
              message={sentMessage} email={email} debugMagicLink={debugMagicLink}
              busy={busy} onResend={handleResend} onContinueUnverified={handleContinueUnverified}
            />
          )}
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
              staffMode={!! staffKey}
              extraEmails={extraEmails} setExtraEmails={setExtraEmails}
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
              companySearch={companySearch}
              pickCompany={(c) => { setChosenCompany(c); setCompanyName('') }}
              busy={busy}
              onContinue={handleClaim}
              staffMode={!! staffKey}
              extraEmails={extraEmails} setExtraEmails={setExtraEmails}
              emailVerified={emailVerified}
            />
          )}
          {step === STEP_MATCHMAKING && (
            <MatchmakingStep
              person={chosenPerson} company={chosenCompany}
              mm={mm} setMm={setMm}
              busy={busy} onSubmit={handleMatchmakingSubmit}
              prefilled={prefilled}
            />
          )}
          {step === STEP_DONE && <DoneStep person={chosenPerson} email={email || matched?.email} testMode={testMode} emailVerified={emailVerified} />}

          <p className="text-center font-body mt-5" style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>
            The first 100 completed applications are entered into the drawing for a Soccerex-covered stay at
            The Ritz-Carlton, South Beach.{' '}
            <a href={RITZ_DRAWING} style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'underline' }}>Official terms</a>
          </p>
        </div>
      </section>
    </div>
  )
}

// Respectable, traceable error banner. Server faults (not the user's fault)
// read warmer/calmer than user-fixable validation errors, and show the
// reference so the visitor can quote it to us.
function SmartErrorBanner({ error }) {
  const e = typeof error === 'string' ? { tone: 'user', message: error } : (error || {})
  const isServer = e.tone === 'server'
  const palette = isServer
    ? { bg: 'rgba(245,158,11,0.13)', border: 'rgba(245,158,11,0.4)', fg: '#fde68a' }
    : e.tone === 'warn'
      ? { bg: 'rgba(245,158,11,0.13)', border: 'rgba(245,158,11,0.4)', fg: '#fde68a' }
      : { bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.35)', fg: '#fecaca' }

  return (
    <div className="mb-4 px-4 py-3 rounded-lg" style={{ background: palette.bg, border: `1px solid ${palette.border}`, color: palette.fg, overflowWrap: 'anywhere' }}>
      <div className="flex items-start gap-2.5">
        <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
        <div style={{ minWidth: 0 }}>
          {e.title && <div className="text-sm font-semibold" style={{ marginBottom: 2 }}>{e.title}</div>}
          <div className="text-sm" style={{ opacity: e.title ? 0.92 : 1 }}>{e.message}</div>
          {e.reference && (
            <div className="text-xs" style={{ marginTop: 6, opacity: 0.85 }}>
              Try again in a few moments, or contact a Soccerex rep with this error code:{' '}
              <span style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>{e.reference}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%', padding: '11px 12px', fontSize: T.input, lineHeight: 1.4,
  background: '#f8f7f4', border: '1px solid rgba(9,32,62,0.12)', borderRadius: 6, color: NAVY, outline: 'none',
}

const primaryButtonStyle = (enabled = true, busy = false) => ({
  background: enabled ? 'var(--color-brand-accent)' : 'rgba(9,32,62,0.18)',
  color: NAVY, padding: '14px 18px', fontSize: T.button, border: 'none', borderRadius: 4,
  cursor: busy ? 'wait' : (enabled ? 'pointer' : 'not-allowed'),
})

function EmailStep({ email, setEmail, busy, onSubmit, staffMode = false }) {
  return (
    <form noValidate onSubmit={onSubmit} className="dna-card">
      {staffMode && (
        <p className="font-body" style={{ fontSize: T.small, color: '#0f766e', background: '#e6fbf6', border: '1px solid rgba(15,118,110,0.25)', borderRadius: 8, padding: '10px 14px', marginBottom: 18, lineHeight: 1.5 }}>
          Soccerex staff: you are filling this in for a partner. Enter their work email and the
          form opens straight away. No email is sent to them to start.
        </p>
      )}
      <p className="font-body" style={{ fontSize: T.lead, color: '#586778', marginBottom: 20, lineHeight: 1.6 }}>
        {staffMode
          ? "Start with the partner's work email. We'll check our database and you can confirm their details with them on the call."
          : "Start with your work email. We'll check our database and let you confirm your details. Most existing contacts can join in under 60 seconds."}
      </p>
      <label htmlFor="dna-email" className="block font-mono uppercase tracking-[0.08em]" style={{ fontSize: T.label, color: NAVY, fontWeight: 600, marginBottom: 8 }}>
        {staffMode ? "Partner's work email" : 'Work email'}
      </label>
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-brand-accent)' }} />
        <input
          id="dna-email"
          type="email" required value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={(e) => setEmail(normalizeApplyEmail(e.target.value))}
          placeholder="you@company.com"
          autoComplete="email"
          disabled={busy}
          style={{ ...inputStyle, padding: '13px 12px 13px 40px' }}
        />
      </div>
      <button type="submit" disabled={busy} className="dna-btn w-full font-body font-semibold uppercase tracking-[0.12em]"
        style={primaryButtonStyle(true, busy)}>
        {busy
          ? <><Loader2 size={16} className="animate-spin" /> {staffMode ? 'Opening' : 'Sending'}</>
          : <>{staffMode ? 'Open the form' : 'Send confirmation link'} <ArrowRight size={16} /></>}
      </button>
      <p className="text-center font-body mt-4" style={{ fontSize: T.small, color: '#7a8896', lineHeight: 1.5 }}>
        <Lock size={12} className="inline-block mr-1" style={{ marginTop: -2 }} />
        {staffMode
          ? 'The application is filed under the address you enter, the same as if they had applied themselves.'
          : "We'll email you a link. Nothing happens until you click it."}
      </p>
    </form>
  )
}

const RESEND_COOLDOWN_MS = 30000

function SentStep({ message, email, debugMagicLink, busy, onResend, onContinueUnverified }) {
  const [resending, setResending] = useState(false)
  const [resentAt, setResentAt] = useState(null)
  const [coolingDown, setCoolingDown] = useState(false)

  useEffect(() => {
    if (! coolingDown) return undefined
    const timer = setTimeout(() => setCoolingDown(false), RESEND_COOLDOWN_MS)
    return () => clearTimeout(timer)
  }, [coolingDown])

  async function resend() {
    if (resending || coolingDown) return
    setResending(true)
    const ok = await onResend()
    setResending(false)
    if (ok) {
      setResentAt(new Date())
      setCoolingDown(true)
    }
  }

  const resendDisabled = busy || resending || coolingDown

  return (
    <div className="dna-card" style={{ textAlign: 'center' }}>
      <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#d4f1e1', color: '#166534', display: 'grid', placeItems: 'center', margin: '0 auto 18px' }}>
        <CheckCircle2 size={28} />
      </div>
      <h2 className="font-heading font-bold" style={{ fontSize: T.title, color: NAVY, marginBottom: 10, lineHeight: 1.25 }}>Check your email</h2>
      <p className="font-body" style={{ fontSize: T.lead, color: '#586778', lineHeight: 1.6 }}>
        {message}
      </p>
      <p className="font-body mt-3" style={{ fontSize: T.body, color: '#7a8896' }}>
        Sent to <span className="font-mono" style={{ overflowWrap: 'anywhere' }}>{email}</span>
      </p>
      {debugMagicLink && (
        <a
          href={debugMagicLink}
          className="dna-btn font-body font-semibold uppercase tracking-[0.12em] mt-5"
          style={{ background: NAVY, color: '#fff', padding: '12px 18px', fontSize: T.small, borderRadius: 4, textDecoration: 'none' }}
        >
          Open test magic link <ArrowRight size={14} />
        </a>
      )}

      {/* Some company mail gateways accept our message and then quarantine it,
          so the link never arrives. This is the way through for them. */}
      <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(9,32,62,0.08)', textAlign: 'left' }}>
        <h3 className="font-heading font-semibold" style={{ fontSize: '1.25rem', color: NAVY, marginBottom: 6, lineHeight: 1.3 }}>
          Email not arriving?
        </h3>
        <p className="font-body" style={{ fontSize: T.body, color: '#586778', lineHeight: 1.55, marginBottom: 14 }}>
          Some company email filters hold messages from new senders, so it can take a while or land in a
          quarantine folder your IT team manages.
        </p>
        <div className="dna-actions">
          <button
            type="button" onClick={resend} disabled={resendDisabled}
            className="dna-btn font-body font-semibold uppercase tracking-[0.1em]"
            style={{ background: 'transparent', color: resendDisabled ? '#9aa6b3' : NAVY, border: '1px solid rgba(9,32,62,0.22)', borderRadius: 4, padding: '12px 14px', fontSize: T.button, cursor: resendDisabled ? 'not-allowed' : 'pointer' }}
          >
            {resending ? <><Loader2 size={15} className="animate-spin" /> Sending</> : 'Send it again'}
          </button>
          <button
            type="button" onClick={onContinueUnverified} disabled={busy}
            className="dna-btn font-body font-semibold uppercase tracking-[0.1em]"
            style={{ background: NAVY, color: '#fff', border: `1px solid ${NAVY}`, borderRadius: 4, padding: '12px 14px', fontSize: T.button, cursor: busy ? 'wait' : 'pointer' }}
          >
            {busy ? <><Loader2 size={15} className="animate-spin" /> Opening</> : <>Continue without confirming <ArrowRight size={15} /></>}
          </button>
        </div>
        {resentAt && (
          <p className="font-body" role="status" style={{ fontSize: T.small, color: '#166534', marginTop: 10 }}>
            Sent again at {resentAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
          </p>
        )}
        <p className="font-body" style={{ fontSize: T.small, color: '#7a8896', lineHeight: 1.5, marginTop: 12 }}>
          If you continue now, your application is still reviewed before approval, and our team will see that
          your email hasn't been confirmed yet. Clicking the link later confirms it.
        </p>
      </div>
    </div>
  )
}

/* White-glove: the caller can put a partner's colleagues on the same
   application, so a team does not have to be run through the form one address
   at a time. They become alternate addresses on the person, which is what the
   portal and the access links read. A two-line box, so the example addresses
   are never cut off on a phone. */
function ColleagueEmails({ value, onChange, disabled }) {
  return (
    <div className="mb-4" style={{ background: '#f4fbf9', border: '1px solid rgba(15,118,110,0.22)', borderRadius: 10, padding: '14px 16px' }}>
      <label htmlFor="dna-colleagues" className="block font-mono uppercase tracking-[0.08em]" style={{ fontSize: T.label, color: '#0f766e', fontWeight: 700, marginBottom: 6 }}>
        Anyone else on this application
      </label>
      <p className="font-body" style={{ fontSize: T.small, color: '#4a6b66', marginBottom: 10, lineHeight: 1.5 }}>
        Colleagues who should reach it too. Separate addresses with commas.
      </p>
      <textarea
        id="dna-colleagues"
        rows={2}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="colleague@company.com, another@company.com"
        autoComplete="off"
        style={{ ...inputStyle, background: '#fff', border: '1px solid rgba(9,32,62,0.14)', resize: 'vertical' }}
      />
    </div>
  )
}

function CompanyResults({ results, onPick, maxHeight }) {
  return (
    <div style={{ background: '#fafaf7', border: '1px solid rgba(9,32,62,0.08)', borderRadius: 8, maxHeight, overflowY: 'auto', overflowX: 'hidden', marginBottom: 12 }}>
      {results.map((c) => (
        <button
          key={c.id} type="button"
          onClick={() => onPick(c)}
          style={{ display: 'block', width: '100%', textAlign: 'left', padding: '11px 14px', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(9,32,62,0.06)', cursor: 'pointer' }}
        >
          <div className="font-body" style={{ fontSize: T.body, color: NAVY, fontWeight: 500, lineHeight: 1.35 }}>{c.display_name}</div>
          {c.headline && <div className="font-body" style={{ fontSize: T.small, color: '#7a8896', lineHeight: 1.4 }}>{c.headline}</div>}
        </button>
      ))}
    </div>
  )
}

function PreviewStep({ matched, chosenPerson, setChosenPerson, chosenCompany, setChosenCompany, companyQuery, companyResults, searchCompanies, onContinue, onNeedCondensed, busy, staffMode = false, extraEmails = '', setExtraEmails = () => {} }) {
  const personMatched = !! matched.person
  const companyMatched = !! matched.company
  const ready = !! (chosenPerson && chosenCompany)

  return (
    <div className="dna-card">
      <p className="font-body" style={{ fontSize: T.lead, color: '#586778', lineHeight: 1.6, marginBottom: 18 }}>
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
          <label htmlFor="dna-preview-company" className="block font-mono uppercase tracking-[0.08em]" style={{ fontSize: T.label, color: NAVY, fontWeight: 600, marginBottom: 6 }}>
            Find your company
          </label>
          <div style={{ position: 'relative', marginBottom: 8 }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9aa6b3' }} />
            <input
              id="dna-preview-company"
              type="text"
              value={companyQuery}
              onChange={(e) => searchCompanies(e.target.value)}
              placeholder="Type at least 2 letters…"
              autoComplete="off"
              style={{ ...inputStyle, paddingLeft: 36 }}
            />
          </div>
          {companyResults.length > 0 && <CompanyResults results={companyResults} onPick={setChosenCompany} maxHeight={220} />}
          <button
            type="button" onClick={onNeedCondensed}
            className="dna-btn font-mono uppercase tracking-[0.1em]"
            style={{ fontSize: T.small, color: PURPLE, background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 0', justifyContent: 'flex-start', textAlign: 'left', gap: 4 }}
          >
            None of these, create new <ChevronRight size={13} />
          </button>
        </div>
      )}

      {staffMode && <div style={{ marginTop: 16 }}><ColleagueEmails value={extraEmails} onChange={setExtraEmails} disabled={busy} /></div>}

      <button
        type="button" onClick={onContinue} disabled={busy || ! ready}
        className="dna-btn w-full mt-5 font-body font-semibold uppercase tracking-[0.12em]"
        style={primaryButtonStyle(ready, busy)}
      >
        {busy ? <><Loader2 size={16} className="animate-spin" /> Saving</> : <>Continue to the questions <ArrowRight size={16} /></>}
      </button>
    </div>
  )
}

/* On a phone the reject control drops under the name instead of squeezing the
   name down to a few pixels (.dna-match wraps once the body is under 170px). */
function MatchCard({ icon: Icon, label, value, subtitle, matched, onReject, rejectLabel }) {
  if (! value) return null
  return (
    <div style={{ background: matched ? 'rgba(34,197,94,0.08)' : '#fafaf7', border: '1px solid ' + (matched ? 'rgba(34,197,94,0.25)' : 'rgba(9,32,62,0.08)'), borderRadius: 10, padding: '14px 16px', marginBottom: 12 }}>
      <div className="dna-match">
        <span style={{ width: 36, height: 36, borderRadius: 9, background: matched ? 'rgba(34,197,94,0.18)' : 'rgba(9,32,62,0.06)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
          <Icon size={16} color={matched ? '#166534' : NAVY} strokeWidth={2.2} />
        </span>
        <div className="dna-match-body">
          <div className="font-mono uppercase tracking-[0.12em]" style={{ fontSize: '0.75rem', color: '#7a8896', fontWeight: 600 }}>{label}</div>
          <div className="font-heading font-semibold" style={{ fontSize: '1.1875rem', color: NAVY, marginTop: 2, lineHeight: 1.3 }}>{value}</div>
          {subtitle && <div className="font-body" style={{ fontSize: T.small, color: '#7a8896', marginTop: 2, lineHeight: 1.4 }}>{subtitle}</div>}
        </div>
        <button type="button" onClick={onReject} className="dna-match-reject font-mono uppercase tracking-[0.1em]" style={{ fontSize: '0.75rem', color: '#7a8896', background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px 0', textAlign: 'right' }}>
          {rejectLabel}
        </button>
      </div>
    </div>
  )
}

/**
 * The details we still need before the intake: who you are, and which company.
 *
 * The company half is a search FIRST, and only a form if the search comes up
 * empty. Showing both at once asked the same question twice and made the search
 * look decorative, so people typed a name that already existed and we grew a
 * second copy of a company we were already tracking.
 */
function CondensedStep(props) {
  const {
    chosenPerson, chosenCompany, personName, setPersonName, personTitle, setPersonTitle,
    companyName, setCompanyName, companyWebsite, setCompanyWebsite, companyCountry, setCompanyCountry,
    companyIndustry, setCompanyIndustry, companyQuery, companyResults, searchCompanies,
    companySearch, pickCompany, busy, onContinue,
    staffMode = false, extraEmails = '', setExtraEmails = () => {},
    emailVerified = true,
  } = props

  const needsPerson = ! chosenPerson
  const needsCompany = ! chosenCompany

  // Only reached by saying the search did not find you, so the form and the
  // search are never on screen together.
  const [addingNew, setAddingNew] = useState(false)

  const canContinue = (! needsPerson || personName.trim() !== '')
    && (! needsCompany || (addingNew && companyName.trim() !== ''))

  const sectionHeading = { fontSize: T.label, color: PURPLE, fontWeight: 700 }
  const status = { fontSize: T.small, color: '#7a8896', marginBottom: 12, lineHeight: 1.45 }

  return (
    <div className="dna-card">
      <p className="font-body" style={{ fontSize: T.lead, color: '#586778', lineHeight: 1.6, marginBottom: 18 }}>
        Tell us the basics. You can fill in the full profile later. This just gets you into the deal-network questions.
      </p>

      {! emailVerified && (
        <p className="font-body" style={{ fontSize: T.small, color: '#7a5b00', background: '#fdf6e3', border: '1px solid rgba(180,140,20,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 18, lineHeight: 1.5 }}>
          Your email isn't confirmed yet, so we can't show details we may already have on file. Enter yours
          below, and click the link in our email whenever it arrives.
        </p>
      )}

      {needsPerson && (
        <div className="mb-4">
          <div className="font-mono uppercase tracking-[0.12em] mb-3" style={sectionHeading}>Your details</div>
          <Field label="Your name" value={personName} onChange={setPersonName} placeholder="Jane Doe" required disabled={busy} />
          <Field label="Title / role" value={personTitle} onChange={setPersonTitle} placeholder="Head of Partnerships" disabled={busy} />
        </div>
      )}

      {needsCompany && (
        <div className="mb-4">
          <div className="font-mono uppercase tracking-[0.12em] mb-3" style={sectionHeading}>Your company</div>

          {! addingNew ? (
            <>
              <label htmlFor="dna-company-search" className="block font-mono uppercase tracking-[0.08em]" style={{ fontSize: T.label, color: NAVY, fontWeight: 600, marginBottom: 6 }}>
                Is your company already on Soccerex?
              </label>
              <div style={{ position: 'relative', marginBottom: 8 }}>
                <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9aa6b3' }} />
                <input
                  id="dna-company-search"
                  type="text"
                  value={companyQuery}
                  onChange={(e) => searchCompanies(e.target.value)}
                  placeholder="Company name…"
                  autoComplete="off"
                  style={{ ...inputStyle, paddingLeft: 38 }}
                />
              </div>

              {companySearch === 'found' && <CompanyResults results={companyResults} onPick={pickCompany} maxHeight={260} />}

              {/* Every other outcome says so out loud. A silent box is why this
                  read as a search that did not work. */}
              {companySearch === 'searching' && (
                <p className="font-body" style={status}>Searching…</p>
              )}
              {companySearch === 'short' && (
                <p className="font-body" style={status}>Keep typing, at least two letters.</p>
              )}
              {companySearch === 'error' && (
                <p className="font-body" style={{ ...status, color: '#b3261e' }}>
                  We could not run that search. You can still add your company below.
                </p>
              )}
              {companySearch === 'empty' && (
                <p className="font-body" style={status}>
                  Nothing on Soccerex matches “{companyQuery}”.
                </p>
              )}

              <button
                type="button" onClick={() => setAddingNew(true)} disabled={busy}
                className="dna-btn w-full font-body font-semibold"
                style={{ background: 'transparent', color: PURPLE, border: '1px solid rgba(107,58,168,0.35)', borderRadius: 6, padding: '12px 16px', fontSize: T.body, cursor: busy ? 'wait' : 'pointer' }}
              >
                {companySearch === 'empty' || companySearch === 'error'
                  ? 'Add it as a new company'
                  : 'My company is not on Soccerex'}
              </button>
            </>
          ) : (
            <>
              <div className="flex items-baseline justify-between flex-wrap gap-2 mb-3">
                <span className="font-body" style={{ fontSize: T.body, color: '#586778' }}>Adding a new company</span>
                <button
                  type="button" onClick={() => setAddingNew(false)} disabled={busy}
                  className="font-body underline"
                  style={{ background: 'transparent', border: 0, color: PURPLE, fontSize: T.small, cursor: busy ? 'wait' : 'pointer', padding: 0 }}
                >
                  Back to search
                </button>
              </div>
              <Field label="Company name" value={companyName} onChange={setCompanyName} placeholder="ACME Marketing Group" required disabled={busy} />
              <Field label="Website" value={companyWebsite} onChange={setCompanyWebsite} placeholder="https://acme.com" type="url" disabled={busy} />
              <div className="dna-row2">
                <Field label="Country" value={companyCountry} onChange={setCompanyCountry} placeholder="United Kingdom" disabled={busy} />
                <Field label="Industry" value={companyIndustry} onChange={setCompanyIndustry} placeholder="Sports marketing" disabled={busy} />
              </div>
            </>
          )}
        </div>
      )}

      {staffMode && <ColleagueEmails value={extraEmails} onChange={setExtraEmails} disabled={busy} />}

      <button
        type="button" onClick={onContinue} disabled={busy || ! canContinue}
        className="dna-btn w-full mt-2 font-body font-semibold uppercase tracking-[0.12em]"
        style={primaryButtonStyle(canContinue, busy)}
      >
        {busy ? <><Loader2 size={16} className="animate-spin" /> Saving</> : <>Continue <ArrowRight size={16} /></>}
      </button>
    </div>
  )
}

/**
 * The intake, asked five screens at a time instead of all at once.
 *
 * Everything here was previously one column roughly two thousand pixels tall.
 * Nobody could see how much was left, so the honest reaction to opening it was
 * to close it. The questions and the payload are unchanged; only how much of it
 * you face at once, and whether you can tell how far along you are.
 *
 * Answers live in the parent's `mm`, so moving back and forth never loses one,
 * and switching side still prunes the signals the new side does not ask about.
 */
const MM_STEPS = [
  { key: 'you', title: 'You', blurb: 'Who is applying, and how we reach you.' },
  { key: 'org', title: 'Organization', blurb: 'What kind of organization you are, and where you operate.' },
  { key: 'bring', title: 'What you bring', blurb: 'What you are taking to market, and what you need.' },
  { key: 'deal', title: 'The deal', blurb: 'Who you want on the other side of the table, and on what terms.' },
  { key: 'extra', title: 'Anything else', blurb: 'Whatever did not fit above.' },
]

const SIDE_OPTIONS = [
  { id: 'property', title: 'Rightsholder', sub: 'Club, federation, league, venue, agency', accent: NAVY, tintBg: 'rgba(9,32,62,0.07)' },
  { id: 'brand', title: 'Commercial Partner', sub: 'Brand, sponsor, technology, media, agency', accent: PURPLE, tintBg: 'rgba(107,58,168,0.08)' },
  { id: 'capital', title: 'Capital Partner / Nonprofit', sub: 'Investor, fund, family office, foundation', accent: GOLD, tintBg: 'rgba(143,129,54,0.12)' },
]

function MatchmakingProgress({ index }) {
  const pct = Math.round(((index + 1) / MM_STEPS.length) * 100)

  return (
    <div className="mb-6">
      <div className="dna-progress-head mb-2">
        <span className="font-heading font-semibold" style={{ fontSize: '1.1875rem', color: NAVY }}>
          {MM_STEPS[index].title}
        </span>
        <span className="font-mono uppercase tracking-[0.08em]" style={{ fontSize: T.label, color: '#7a8896', whiteSpace: 'nowrap' }}>
          Step {index + 1} of {MM_STEPS.length}
        </span>
      </div>

      {/* One bar, plus a tick per step. The bar answers "how much is left" at a
          glance; the ticks let you see which parts you have already been through. */}
      <div
        role="progressbar"
        aria-valuenow={index + 1}
        aria-valuemin={1}
        aria-valuemax={MM_STEPS.length}
        aria-label={`Step ${index + 1} of ${MM_STEPS.length}: ${MM_STEPS[index].title}`}
        style={{ height: 6, borderRadius: 999, background: 'rgba(9,32,62,0.10)', overflow: 'hidden' }}
      >
        <div style={{ width: `${pct}%`, height: '100%', background: 'var(--color-brand-accent)', transition: 'width .25s ease' }} />
      </div>

      {/* Position only. Spelling all five names out under the bar wrapped them onto
          two lines at this type size, and the step you are on is already named in
          full, larger, directly above. */}
      <div className="flex gap-1.5 mt-2" aria-hidden="true">
        {MM_STEPS.map((s, i) => (
          <span
            key={s.key}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 999,
              background: i <= index ? 'var(--color-brand-accent)' : 'rgba(9,32,62,0.12)',
            }}
          />
        ))}
      </div>
    </div>
  )
}

function MatchmakingStep({ person, company, mm, setMm, busy, onSubmit, prefilled = false }) {
  const toggle = (key, v) => setMm({ ...mm, [key]: mm[key].includes(v) ? mm[key].filter((x) => x !== v) : [...mm[key], v] })
  const set = (key) => (v) => setMm({ ...mm, [key]: v })

  const form = INTAKE_FORMS[mm.side]
  const isCapital = mm.side === 'capital'

  const [index, setIndex] = useState(0)
  const topRef = useRef(null)
  const targetsRef = useRef(null)
  const last = MM_STEPS.length - 1
  const targetsProblem = namedTargetsProblem(mm.named_targets)

  // Land on the new question, not halfway down it. Without this a long screen
  // followed by a short one leaves you scrolled past the top of the short one.
  // scrollMarginTop on the card clears the 73px fixed nav, which would otherwise
  // sit over the step heading you just scrolled to.
  function go(next, target = topRef) {
    setIndex(next)
    if (typeof window !== 'undefined') {
      window.requestAnimationFrame(() => {
        target.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }
  }

  // The backend refuses the whole application over one named target it will not
  // store, and its error shows in the banner at the top of the page while the
  // applicant is on the last screen, one screen past the field. So Submit with a
  // list that cannot save goes back to that field, where the reason is already
  // showing, and sends nothing.
  function submit() {
    if (targetsProblem) {
      go(3, targetsRef)
      return
    }
    onSubmit()
  }

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
    <div ref={topRef} className="dna-card" style={{ scrollMarginTop: 96 }}>
      {/* Correcting who you are applying as needs a backend route: the magic-link
          token is consumed by the claim that got you here, so re-claiming from
          this screen always fails with invalid_or_expired. The control is out
          until switching is supported properly. */}
      <div className="flex items-start gap-2.5 mb-4 p-3 rounded-lg" style={{ background: 'rgba(107,58,168,0.08)', border: '1px solid rgba(107,58,168,0.2)' }}>
        <Sparkles size={16} color={PURPLE} style={{ flexShrink: 0, marginTop: 3 }} />
        <span className="font-body" style={{ fontSize: T.body, color: NAVY, lineHeight: 1.45 }}>
          Applying as <strong>{person?.display_name}</strong> at <strong>{company?.display_name}</strong>
        </span>
      </div>

      {prefilled && (
        <p className="font-body" style={{ fontSize: T.small, color: '#0f766e', background: '#e6fbf6', border: '1px solid rgba(15,118,110,0.25)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, lineHeight: 1.5 }}>
          We filled these in from {company?.display_name ? <strong>{company.display_name}</strong> : 'your company'}'s
          last application. Change anything that is out of date.
        </p>
      )}

      <h2 className="font-heading font-bold mb-2" style={{ fontSize: T.title, color: NAVY, lineHeight: 1.25 }}>Deal Network intake</h2>
      <p className="font-body mb-5" style={{ fontSize: T.lead, color: '#586778', lineHeight: 1.55 }}>
        {MM_STEPS[index].blurb}
      </p>

      <MatchmakingProgress index={index} />

      {index === 0 && (
        <>
          {/* Side selector: drives which tailored form renders on every screen below.
              One card per row. Three across put "Commercial Partner" in a 120px box
              it could not fit. */}
          <div className="mb-5">
            <Label>Which best describes you?</Label>
            <div className="dna-sides" role="radiogroup" aria-label="Which best describes you?">
              {SIDE_OPTIONS.map((opt) => {
                const active = mm.side === opt.id
                return (
                  <button
                    key={opt.id} type="button" onClick={() => setSide(opt.id)}
                    role="radio" aria-checked={active}
                    style={{ width: '100%', textAlign: 'left', background: active ? opt.tintBg : '#f8f7f4', border: '1.5px solid ' + (active ? opt.accent : 'rgba(9,32,62,0.12)'), borderRadius: 10, padding: '11px 14px', cursor: 'pointer' }}
                  >
                    <div className="font-heading font-semibold" style={{ fontSize: T.lead, color: active ? opt.accent : NAVY, lineHeight: 1.3 }}>{opt.title}</div>
                    <div className="font-body" style={{ fontSize: T.small, color: '#7a8896', marginTop: 2, lineHeight: 1.4 }}>{opt.sub}</div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="dna-row2">
            <Field label="Website" value={mm.website} onChange={set('website')} placeholder="https://yourcompany.com" type="url" disabled={busy} />
            <Field label="Phone / WhatsApp" value={mm.phone} onChange={set('phone')} placeholder="+1 305 555 0100" type="tel" disabled={busy} />
          </div>
          <div className="mb-4">
            <Label>Will the decision-maker attend Miami?</Label>
            <ChipGroup options={['Yes', 'No', 'TBC']} value={mm.attendance ? [mm.attendance === 'tbc' ? 'TBC' : mm.attendance === 'yes' ? 'Yes' : 'No'] : []}
              onToggle={(label) => {
                const v = label.toLowerCase()
                setMm({ ...mm, attendance: mm.attendance === v ? '' : v })
              }} />
          </div>
        </>
      )}

      {index === 1 && (
        <>
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
        </>
      )}

      {index === 2 && (
        <>
          <Field label={form.pitchLabel} value={mm.pitch} onChange={set('pitch')} placeholder={form.pitchPlaceholder} disabled={busy} textarea rows={4} />

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
        </>
      )}

      {index === 3 && (
        <>
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

          <Field label={form.counterpartLabel} value={mm.ideal_counterpart} onChange={set('ideal_counterpart')} placeholder={form.counterpartPlaceholder} disabled={busy} textarea />
          <div ref={targetsRef} style={{ scrollMarginTop: 96 }}>
            <Field label="Named targets (optional: specific clubs, leagues, federations, or companies, one per line)" value={mm.named_targets} onChange={set('named_targets')} placeholder={'Atlanta United\nLA Galaxy\nFC Cincinnati'} disabled={busy} textarea />
            {targetsProblem && (
              <p className="font-body" style={{ fontSize: T.small, color: '#b3261e', marginTop: -6, marginBottom: 14, lineHeight: 1.45 }}>
                {targetsProblem}
              </p>
            )}
          </div>

          <div className="dna-row2">
            <SelectField label={form.budgetLabel} value={mm.budget_range} onChange={set('budget_range')} options={[...form.budgets, 'Other']} disabled={busy} />
            <Field label="Decision timeline (optional)" value={mm.decision_timeline} onChange={set('decision_timeline')} placeholder="Q3 2026, before Miami" disabled={busy} />
          </div>
          {mm.budget_range === 'Other' && (
            <Field label={`${form.budgetLabel} (other)`} value={mm.budget_other} onChange={set('budget_other')} placeholder="Type it in" disabled={busy} />
          )}

          {isCapital && (
            <>
              <SelectField label="Primary geography of investment interest" value={mm.investment_geography} onChange={set('investment_geography')} options={INTAKE_REGIONS} disabled={busy} />
              <Field label="Leagues or competitions of interest (optional)" value={mm.leagues_interest} onChange={set('leagues_interest')} placeholder="e.g., MLS, Liga MX, Championship" disabled={busy} />
            </>
          )}
        </>
      )}

      {index === 4 && (
        <Field
          label="Anything else we should know? (optional)"
          value={mm.additional_context} onChange={set('additional_context')}
          placeholder={isCapital
            ? "Context that doesn't fit above: prior deal attempts, specific constraints, ESG mandates, fund cycle timing, etc."
            : "Context that doesn't fit above: prior deal attempts, specific constraints, preferences, etc."}
          disabled={busy} textarea rows={5}
        />
      )}

      {/* Back sits beside Next rather than under it, so the primary action keeps
          the same place on every screen and never moves under your thumb. Next
          takes the remaining width and wraps its own label on a phone rather
          than pushing past the card. */}
      <div className="dna-nav">
        {index > 0 && (
          <button
            type="button" onClick={() => go(index - 1)} disabled={busy}
            className="dna-btn dna-back font-body font-semibold uppercase tracking-[0.1em]"
            style={{ background: 'transparent', color: NAVY, padding: '14px 16px', fontSize: T.button, border: '1px solid rgba(9,32,62,0.18)', borderRadius: 4, cursor: busy ? 'wait' : 'pointer' }}
          >
            Back
          </button>
        )}

        {index < last ? (
          <button
            type="button" onClick={() => go(index + 1)} disabled={busy}
            className="dna-btn dna-next font-body font-semibold uppercase tracking-[0.12em]"
            style={primaryButtonStyle(true, busy)}
          >
            Continue <ArrowRight size={16} />
          </button>
        ) : (
          <button
            type="button" onClick={submit} disabled={busy}
            className="dna-btn dna-next font-body font-semibold uppercase tracking-[0.12em]"
            style={primaryButtonStyle(true, busy)}
          >
            {busy ? <><Loader2 size={16} className="animate-spin" /> Submitting</> : <>Submit application <ArrowRight size={16} /></>}
          </button>
        )}
      </div>

      <p className="font-body mt-3" style={{ fontSize: T.small, color: '#7a8896', lineHeight: 1.5 }}>
        Every question is optional except the ones marked. You can go back at any point without losing an answer.
      </p>
    </div>
  )
}

function SelectField({ label, value, onChange, options, disabled }) {
  const id = useId()
  return (
    <div style={{ marginBottom: 14 }}>
      <Label htmlFor={id}>{label}</Label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled}
        style={{ ...inputStyle, paddingRight: 8, textOverflow: 'ellipsis' }}>
        <option value="">Choose one</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

const chipStyle = (active) => ({
  background: active ? NAVY : '#f8f7f4', color: active ? '#fff' : NAVY,
  border: '1px solid ' + (active ? NAVY : 'rgba(9,32,62,0.12)'), borderRadius: 999,
  padding: '6px 12px', fontSize: T.chip, lineHeight: 1.35, cursor: 'pointer', textAlign: 'left', maxWidth: '100%',
})

/* Chips whose VALUES are taxonomy keys but whose labels vary per side. */
function KeyedChips({ options, value, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(([key, label]) => {
        const active = value.includes(key)
        return (
          <button key={key} type="button" onClick={() => onToggle(key)} aria-pressed={active} style={chipStyle(active)}>
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
      aria-label="Other (type in)"
      style={{ ...inputStyle, marginTop: 8, padding: '9px 12px', background: '#fcfbf9', border: '1px dashed rgba(9,32,62,0.18)' }}
    />
  )
}

function DoneStep({ person, email, testMode, emailVerified = true }) {
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
    <div className="dna-card" style={{ textAlign: 'center' }}>
      <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-brand-accent), #d4c78e)', display: 'grid', placeItems: 'center', margin: '0 auto 20px', boxShadow: '0 20px 60px rgba(191,177,112,0.45)' }}>
        <CheckCircle2 size={36} color={NAVY} />
      </div>
      <h2 className="font-heading font-bold mb-3" style={{ fontSize: '2rem', color: NAVY, lineHeight: 1.2 }}>You're in</h2>
      <p className="font-body mb-2" style={{ fontSize: T.lead, color: '#586778', lineHeight: 1.6 }}>
        Thanks <strong>{person?.display_name}</strong>. The Soccerex team will review your application and reach out with proposed introductions.
      </p>
      <p className="font-body" style={{ fontSize: T.body, color: '#7a8896' }}>
        Expect to hear back within two business days.
      </p>
      {! emailVerified && (
        <p className="font-body" style={{ fontSize: T.small, color: '#7a5b00', background: '#fdf6e3', border: '1px solid rgba(180,140,20,0.3)', borderRadius: 8, padding: '10px 14px', marginTop: 16, lineHeight: 1.5, textAlign: 'left' }}>
          When our confirmation email reaches you, click the link in it to confirm your address. Your
          application is already with the team either way.
        </p>
      )}

      {/* Profile continuity: the application lives on their Soccerex profile,
          so hand them the door to it instead of a dead end. */}
      <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(9,32,62,0.08)', textAlign: 'left' }}>
        <h3 className="font-heading font-semibold" style={{ fontSize: '1.25rem', color: NAVY, marginBottom: 6, lineHeight: 1.3 }}>Your Soccerex profile</h3>
        <p className="font-body" style={{ fontSize: T.body, color: '#586778', lineHeight: 1.6, marginBottom: 12 }}>
          This application is saved to <strong>{person?.display_name}</strong>'s Soccerex profile. Your portal keeps everything in one place: Deal Network requests and meetings, event access, speaking, and your profile details.
        </p>
        {portalRequested ? (
          <p className="font-body" style={{ fontSize: T.body, color: '#166534' }}>
            ✓ Check your inbox. We emailed you a secure link to your Soccerex portal.
          </p>
        ) : (
          <button type="button" onClick={requestPortalLink} disabled={portalBusy}
            className="dna-btn font-body font-semibold uppercase tracking-[0.1em]"
            style={{ background: NAVY, color: '#fff', padding: '11px 18px', fontSize: T.small, border: 'none', borderRadius: 6, cursor: portalBusy ? 'wait' : 'pointer' }}>
            {portalBusy ? <><Loader2 size={14} className="animate-spin" /> Sending</> : <>Open my Soccerex portal <ArrowRight size={14} /></>}
          </button>
        )}
      </div>
    </div>
  )
}

function Field({ label, value, onChange, placeholder, type = 'text', required, textarea, disabled, rows = 3 }) {
  const id = useId()
  return (
    <div style={{ marginBottom: 14 }}>
      <Label htmlFor={id}>
        {label}{required && <span style={{ color: 'var(--color-brand-accent)', marginLeft: 4 }}>*</span>}
      </Label>
      {textarea ? (
        <textarea id={id} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} disabled={disabled} rows={rows}
          style={{ ...inputStyle, resize: 'vertical' }} />
      ) : (
        <input id={id} type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} disabled={disabled}
          style={inputStyle} />
      )}
    </div>
  )
}

/* Field labels: mono uppercase, sized for the card so a long question wraps to
   two lines on a phone instead of five. */
function Label({ children, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className="block font-mono uppercase tracking-[0.06em] mb-2" style={{ fontSize: T.label, color: NAVY, fontWeight: 600, lineHeight: 1.45 }}>{children}</label>
  )
}

function ChipGroup({ options, value, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = value.includes(o)
        return (
          <button key={o} type="button" onClick={() => onToggle(o)} aria-pressed={active} style={chipStyle(active)}>
            {o}
          </button>
        )
      })}
    </div>
  )
}
