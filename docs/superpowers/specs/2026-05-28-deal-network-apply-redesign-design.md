# Deal Network Apply Redesign — Design Spec

**Date:** 2026-05-28
**Status:** Approved (pending implementation plan)
**Repos touched:** `Soccerex-front` (React), `Soccerex-back` (Laravel)

## Problem

The Deal Network apply flow already exists (email-first, magic-link verification,
company search-suggest dedup, profile + company creation) but:

1. The wants/needs ("pain points") matching interface is generic and not
   type-aware. It is two identical chip groups using the same option set
   regardless of whether the applicant is a property/rightsholder or a brand.
2. There are no staged applicant notifications through the lifecycle.
3. The public `/deal-network` marketing page does not funnel into the apply
   flow (the apply page is currently unlinked by design).

The wants/needs taxonomy is the data we use to match properties with brands, so
getting it modeled correctly is the core of this work.

## What already exists (reuse, do not rebuild)

Backend `App\Http\Controllers\Api\DealNetworkApplyController`:
- `start(email)` → issues a 30-min magic-link token, emails it (`MagicLinkMail`).
- `preview(token)` → returns matched person + company (dedup by email, then
  company-website-domain == email-domain, then company-name match).
- `searchCompanies(token, q)` → company search-suggest across brand/club/
  federation profiles (dedup helper).
- `claim(token, ...)` → inside a DB transaction: resolves/creates the person
  Profile and the company Profile (with a final domain-based dedup pass),
  links person→company via `attributes.company_id`, consumes the magic-link
  token, and issues a fresh 60-min `deal-network-matchmaking` token.

Frontend `src/pages/DealNetworkApply.jsx` (routed at `/deal-network/apply`):
- Steps: email → sent → preview → condensed (no-match) → matchmaking → done.
- Company search-suggest wired in both preview and condensed steps.
- Final submit calls `submitDealNetworkIntake(...)`.

API client `src/lib/soccerexApi.js`: `dealNetworkApplyStart`,
`dealNetworkApplyPreview`, `dealNetworkSearchCompanies`, `dealNetworkApplyClaim`,
`submitDealNetworkIntake`.

## Scope of this change

### 1. Type-aware capability grid (frontend)

Replace `MatchmakingStep`'s two generic chip groups with a single capability
grid. Each capability row offers up to two checkboxes: **Looking for** and
**Can provide**. Ticking both expresses "both" (no separate third control —
cleaner data, same outcome). Cells that do not make sense for the applicant's
type are **hidden** so nonsensical options never render.

**Applicant type** is derived from the claimed company Profile. Backend
`profiles.type` is one of `person / brand / club / federation` (no separate
`league` or `venue` type). Mapping:
- company Profile type `club` or `federation` → **Property** (rightsholder side)
- company Profile type `brand` → **Brand** (company side)
- The existing apply code already maps `club`/`federation` → `rightsholder`
  and everything else → `company`; reuse that exact mapping. Property = the
  rightsholder side, Brand = the company side.

If a company's type is genuinely ambiguous (rare brand records that are really
rightsholders), the grid should fall back to showing BOTH columns for every
capability rather than hiding anything — better to over-show than block a valid
entry. This fallback only triggers when the side cannot be determined.

**Capability taxonomy** (✓ = that checkbox renders for that type):

| Capability | Property: Looking / Provide | Brand: Looking / Provide |
|---|---|---|
| Brand exposure & visibility | – / ✓ | ✓ / – |
| Sponsorship inventory | – / ✓ | ✓ / – |
| Audience & fan access | – / ✓ | ✓ / – |
| Hospitality & experiences | – / ✓ | ✓ / – |
| Merchandising & licensing | – / ✓ | ✓ / – |
| Capital & investment | ✓ / – | – / ✓ |
| Technology & platforms | ✓ / – | – / ✓ |
| Distribution & commercial reach | ✓ / – | – / ✓ |
| Advisory & services | ✓ / – | – / ✓ |
| Media & broadcast rights | ✓ / ✓ | ✓ / ✓ |
| Content & IP | ✓ / ✓ | ✓ / ✓ |
| Data & analytics | ✓ / ✓ | ✓ / ✓ |
| Talent & representation | ✓ / ✓ | ✓ / ✓ |
| Stadium, venue & infrastructure | ✓ / ✓ | ✓ / ✓ |
| Market entry & geographic reach | ✓ / ✓ | ✓ / ✓ |

Top block encodes the typical, non-reversible asymmetry; bottom block is
genuinely two-directional. The taxonomy lives in one config object in the
frontend (single source of truth), structured so a capability declares which
columns are valid per side, e.g.:

```js
{ key: 'brand_exposure', label: 'Brand exposure & visibility',
  property: { looking: false, provide: true },
  brand:    { looking: true,  provide: false } }
```

A capability is hidden entirely if neither column is valid for the side.

**Mapping to the existing payload:** the grid produces two arrays —
`looking_for` (capabilities ticked "Looking for") and `can_offer` (ticked
"Can provide"). These already exist on the `submitDealNetworkIntake` payload,
so no backend schema change is needed for the grid. The capability `label`
strings are what gets stored (human-readable in the admin lead view).

### 2. Lifecycle notifications (backend, via SES)

Four new mailables, delivered through the existing SES failover mailer
(`config/leads.php` recipients pattern not reused here — these go to the
applicant). Reply-to = `enquiries@soccerex.com`.

1. **Application received** — automatic, fired on successful intake submit.
   Confirms profile + company were created/linked; sets the ~2-business-day
   expectation; explains what happens next.
2. **Profile/company claim confirmation** — automatic, fired during `claim`
   ONLY when a brand-new company Profile was created (not when an existing one
   was matched). Tells them a company record now exists for them.
3. **Membership under review / approved** — fired by an admin action in
   Filament when the membership/application status moves to approved.
4. **Introductions proposed** — **strictly admin-fired for now** (not
   automatic). Fired by a concierge/admin action when a curated match is
   proposed; links to the existing Deal Network portal.

Stages 1–2 are automatic (frontend-driven submit). Stages 3–4 are triggered by
the Soccerex team from the backend admin. No automatic matching logic ships in
this change.

### 3. Marketing page → apply funnel (frontend, folds into v4-D copy work)

- The public `/deal-network` page becomes the marketing/explainer page with the
  v4 copy ("SOCCEREX DEAL NETWORK / Curated Access. Commercial Outcomes."), and
  its CTAs ("REQUEST DEAL NETWORK ACCESS") link to `/deal-network/apply`.
- The old single-shot intake form on `/deal-network` (the A1–A5 work) is
  **retired** in favor of the apply flow. One funnel.

## Data flow

```
email
  → start            (issue magic-link token, send email)
  → click link       (?token=)
  → preview          (matched person + company)
  → claim            (create/link person + company, issue matchmaking token,
                      + "claim confirmation" email IF new company created)
  → capability grid + one-sentence pitch + geography/budget/timeline
  → submitIntake     (write application + "application received" email)
  → [admin] approve  (→ "approved" email)
  → [admin] propose  (→ "introductions proposed" email, links to portal)
  → portal
```

## Out of scope (explicitly)

- Automatic matching/scoring. Matches stay concierge/admin-driven.
- Changes to the magic-link auth system itself.
- Portal redesign (the existing Deal Network portal is unchanged).
- Backend schema migrations for the grid (existing `looking_for` / `can_offer`
  arrays are sufficient).

## Risks / notes

- The capability `label` strings become matching keys in the admin view; keep
  them stable once shipped (changing a label re-buckets historical data).
- "Approved" and "Introductions proposed" require admin trigger points in
  Filament; the implementation plan must locate or add those actions.
- Retiring the old `/deal-network` intake means any existing deep links to it
  should redirect to `/deal-network/apply`.
