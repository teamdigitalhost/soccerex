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

**Capability taxonomy — uses the EXISTING backend keys.** The backend already
defines a fixed vocabulary in `app/Support/DealNetwork/SignalTaxonomy.php`
(`NEED_OFFER`, 14 keys) and validates `looking_for[]` / `can_offer[]` against
`SignalTaxonomy::needOfferKeys()` via `Rule::in(...)` in `DealNetworkController`.
Signals are then written relationally into `IntakeSignal` rows by
`IntakeSignalWriter::sync`. Therefore the grid MUST emit these exact keys —
free-text labels would 422. We reuse the 14 keys as the grid rows and add a
**frontend-only** per-type validity map. No backend taxonomy change, no
migration.

The 14 keys (key → label) and their per-type column validity
(✓ = that checkbox renders for that side):

| key | label | Property: Look / Provide | Brand: Look / Provide |
|---|---|---|---|
| sponsorship_inventory | Sponsorship inventory | – / ✓ | ✓ / – |
| fan_audience_access | Fan / audience access | – / ✓ | ✓ / – |
| hospitality_experiences | Hospitality & experiences | – / ✓ | ✓ / – |
| merchandising_licensing | Merchandising & licensing | – / ✓ | ✓ / ✓ |
| investment_capital | Investment / capital | ✓ / – | – / ✓ |
| technology_platform | Technology & platform | ✓ / – | – / ✓ |
| media_broadcast_rights | Media & broadcast rights | ✓ / ✓ | ✓ / ✓ |
| content_ip | Content & IP | ✓ / ✓ | ✓ / ✓ |
| data_analytics | Data & analytics | ✓ / ✓ | ✓ / ✓ |
| talent_representation | Talent & representation | ✓ / ✓ | ✓ / ✓ |
| stadium_venue_infrastructure | Stadium / venue / infrastructure | ✓ / ✓ | ✓ / ✓ |
| distribution_commercial_reach | Distribution & commercial reach | ✓ / ✓ | ✓ / ✓ |
| ma_equity | M&A / equity | ✓ / ✓ | ✓ / ✓ |
| advisory_services | Advisory & services | ✓ / ✓ | ✓ / ✓ |

Top block = typical non-reversible asymmetry; lower block = two-directional.
The validity map is one frontend config object keyed by SignalTaxonomy key:

```js
{ key: 'sponsorship_inventory',
  property: { looking: false, provide: true },
  brand:    { looking: true,  provide: false } }
```

Labels are pulled from `SignalTaxonomy::needOfferMap()` so the frontend and
backend never drift. A capability is hidden for a side only if neither column
is valid for it.

**The "pain points" dimension stays.** `SignalTaxonomy` also has a separate
12-key `PAIN` vocabulary, and the intake payload already carries `pain_points[]`
+ `pain_point_detail`. The user's "wants/needs/pain-points" language maps to two
distinct signals: the need/offer grid (primary matching) and the pain list
(secondary context). Keep a short optional pain-point question after the grid;
do NOT silently drop it (the previous redesign omitted it — that was a
regression).

**Mapping to the existing payload:** the grid produces `looking_for[]` (keys
ticked "Looking for") and `can_offer[]` (keys ticked "Can provide"). Both fields
already exist and are validated; the backend `IntakeSignalWriter` syncs them
into `IntakeSignal` rows. No schema change.

### 2. Lifecycle notifications (backend, via SES)

Four new mailables, delivered through the existing SES failover mailer
(`config/leads.php` recipients pattern not reused here — these go to the
applicant). Reply-to = `enquiries@soccerex.com`.

1. **Application received** — automatic. Fired **server-side inside the intake
   submit** (in `DealNetworkController::submitIntake` after the row is created),
   not from the frontend, so it cannot be missed. Confirms profile + company
   created/linked; sets ~2-business-day expectation.
2. **Profile/company claim confirmation** — automatic, fired inside `claim`
   ONLY when a brand-new company Profile was created (not when an existing one
   was matched).
3. **Membership approved** — admin-fired. NOTE: there is no `STATUS_APPROVED`;
   membership statuses are `prospect / active / paused / completed / declined`
   (`Membership.php`). "Approved" = transition to `STATUS_ACTIVE`. This requires
   **building a Filament action** on `DealNetworkMembershipResource` (today it
   has only Edit/Delete) that sets status=active and sends the email.
4. **Introductions proposed** — **strictly admin-fired** (no automatic matching
   in this change). Requires **building a Filament action** on
   `DealNetworkMatchResource` (today only Edit/Delete) that sends the email and
   links to the existing portal.

Stages 1–2 are automatic. Stages 3–4 each require a NEW Filament admin action to
be built (they do not exist today). All four mailables are new: `app/Mail`
already holds 8 mailables (AdminBroadcastMail, CampaignMailable, InvoiceMail,
LeadReceivedNotification, MagicLinkMail, ProfileInvitationMail,
ProfileSelfServiceLinkMail, RightsHolderApplicationDecisionMail) but NONE are
deal-network applicant lifecycle emails — so all four proposed here are net-new.

### 3. Marketing page → apply funnel (frontend, folds into v4-D copy work)

- `/deal-network` (`DealNetwork.jsx`) is **already a marketing/explainer page
  with no form** — there is nothing to "retire." This task is purely: apply the
  v4 copy and point its CTAs ("REQUEST DEAL NETWORK ACCESS") at
  `/deal-network/apply`. One funnel.

## Multiple stakeholders per company (Option A — chosen)

Membership is **per company + event**, not per person. Multiple people from the
same company are stakeholders, each with their **own Intake** under the one
shared Membership (`Membership hasMany Intake` already exists).

Required `submitIntake` changes (the current behavior is buggy for this case —
it `updateOrCreate`s one membership keyed on a fuzzy email/name match and
overwrites `attributes.deal_network_last_contact` on every submit):

1. **Resolve the company from the `claim` result, not a fuzzy name match.**
   Thread `company_id` (and `person_id`) from `claim` through the matchmaking
   token context into `submitIntake`. The Membership attaches to the **company**
   profile id, keyed `(company_profile_id, event_id)`.
2. **Append, don't overwrite.** Each submission creates a NEW `Intake` row under
   that membership, tagged with the submitting person (`submitted_by_email` +
   the linked person profile id). Never clobber a prior stakeholder's intake.
   Re-submission by the *same* person + same event updates *their* existing
   intake (idempotency via the validated matchmaking token + submitter email),
   not anyone else's.
3. **Set `side` once.** The company-level `side` is set from the first intake
   (or the Property/Brand confirmation). Later submissions do NOT flip it; a
   disagreement is recorded on the intake and surfaced to the concierge as a
   flag, not an overwrite.
4. **Stop using `attributes.deal_network_last_contact` as the contact of
   record.** Keep per-stakeholder identity on the Intake instead. The company
   profile may keep a lightweight "most recent contact" pointer for convenience
   but it is not authoritative.

Concierge view: one company membership, N stakeholder intakes beneath it, each
with that person's own wants/needs/pain-points. Matching is company-to-company;
individual briefs are preserved.

## Data flow

```
email
  → start            (issue magic-link token, send email)
  → click link       (?token=)
  → preview          (matched person + company)
  → claim            (create/link person + company, issue matchmaking token,
                      + "claim confirmation" email IF new company created)
  → capability grid + one-sentence pitch + geography/budget/timeline
  → submitIntake     (send matchmaking_token + side; server validates token,
                      writes/updates application, sets Membership.side,
                      sends "application received" email)
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

- **Free-email type bias (must address).** `claim` creates a brand-new company
  as `TYPE_BRAND` by default, and `emailDomain()` skips free-email domains
  (gmail/yahoo/etc) for dedup. Result: a freemail applicant who creates a new
  company always lands on the **Brand** side, so the grid shows the brand
  asymmetry even for a rightsholder. The "show both columns" fallback does NOT
  rescue this because the side IS determinable (just defaulted). Fix: when the
  side was defaulted / low-confidence, show an explicit one-tap "Which best
  describes you? Property (rightsholder) / Brand (company)" confirmation before
  the grid, and let it set the side. (This mirrors the old A1–A5 2-option
  selector.)
- **Where `side` actually persists (corrected).** `claim` does NOT create or
  touch a `Membership` — it only creates/links Profiles and issues the
  matchmaking token. `Membership.side` is set later in
  `DealNetworkController::submitIntake`, from the `side` field in the submit
  payload (the frontend derives it today at `DealNetworkApply.jsx`). So the
  Property/Brand confirmation must drive the `side` value sent to `submitIntake`
  — that is the single place side is written. The grid's per-capability signals
  are separate from `side`: a property may tick some brand-side capabilities
  without changing its membership side (side = primary identity; grid =
  granular signals).
- **Matchmaking token is currently a no-op at submit (must decide).** The real
  risk is not expiry. `submitIntake` is a PUBLIC, unauthenticated route
  (`routes/api.php`, `throttle:30,1`). The 60-min `deal-network-matchmaking`
  token is captured client-side after `claim` but is NOT sent in the submit
  payload and is never validated server-side — so the email-first/magic-link
  verification does not actually gate the final submit, and `submitIntake` has
  no idempotency (each call creates a fresh LeadSubmission + Intake;
  `updateOrCreate` applies only to the Membership). The plan MUST decide to
  thread the `matchmaking_token` into `submitIntake` and validate it
  server-side, so: (a) the submit is tied to the verified email/profile from
  `claim`, (b) re-submits update rather than duplicate, and (c) an expired
  token routes the user back to "re-enter your email." Recommendation: require
  + validate the token; treat a valid-token re-submit as an update to the
  existing intake.
- Capability **keys** (not labels) are the stored matching values; labels come
  from `SignalTaxonomy::needOfferMap()`. Keys must stay stable once shipped.
- No deep-link redirect needed for the old intake — `/deal-network` was already
  a marketing page; there is no stale form route to redirect.
