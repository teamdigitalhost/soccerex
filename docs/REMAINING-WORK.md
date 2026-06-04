# Soccerex website — remaining work backlog

**Last updated:** 2026-06-03
**Scope:** what's left after the comments-doc rounds (v2.1 / v2.2 / GN / v4) and the
Deal Network apply build. Everything here is structural (backend / forms / new
flow) or a larger copy+layout job — the small copy swaps are done and live.

Repos:
- Frontend (React/Vite): `Soccerex-front` — deploys **manually** via `npm run build && netlify deploy --prod --dir=dist` (Netlify bills per deploy).
- Backend (Laravel): `Soccerex-back` — auto-deploys on **push to `main`** (Laravel Cloud). Production: `https://soccerex.digitalhost.co`.

Design spec for the Deal Network items below:
`docs/superpowers/specs/2026-05-28-deal-network-apply-redesign-design.md`
Business source-of-truth: the **Deal Network Hybrid Deck v1** (the deck is the
canonical language + process; the website should mirror it).

---

## 0. Open one-shot (do first, ~2 min)

**Run the article placeholder cleanup on production.** The `articles:strip-placeholders`
artisan command is deployed to production but content isn't cleaned until it runs.
In the Laravel Cloud console:
```bash
php artisan articles:strip-placeholders          # dry-run, preview
php artisan articles:strip-placeholders --apply   # persist
```
Idempotent; strips lone "CTA"/"TBD"/etc. paragraphs from article bodies. The live
site already hides them via a frontend filter (`InsightArticle.jsx`), so this is
source-of-truth hygiene, not urgent.

---

## 1. Deal Network — third track: Capital & Impact Partners (C1)  ⬅ anchor

**Why:** The deck defines THREE participation tracks, not two. The shipped apply
flow is two-sided (Property/rightsholder vs Brand/company). The deck adds a
distinct **Capital & Impact Partners** track — PE, family offices, financial
institutions, funds, nonprofits — with its own value prop and an "apply to join /
curated access" entry. Today these fold into the Brand side; the deck wants them
as their own track.

**Needs a short spec first** (this changes the apply flow + capability model):
- New side/track value beyond `property`/`brand`. Backend `Membership.side` is an
  enum `company | rightsholder | both` (`app/Models/DealNetwork/Membership.php`) —
  decide whether "capital" is a new side, a `member_type`, or a tag. The capability
  grid (`Soccerex-front/src/pages/DealNetworkApply.jsx` → `CAPABILITIES`,
  `deriveSide`, `SideConfirm`) is currently property/brand only.
- The deck's Capital & Impact "What They Get": curated intros to clubs/leagues/
  federations seeking capital, proprietary deal flow, closed roundtables, etc.
- Entry: the `?track=capital` URL param already lands these on the company side as
  a placeholder (`DealNetworkApply.jsx`, search `trackSide`) — wire it to the real
  third track once it exists.

**Effort:** medium. Spec → frontend (grid + a third SideConfirm option + track
copy) → backend (`SignalTaxonomy`/`Membership` if the model needs a new value).

---

## 2. Deal Network — 6-step process (C2)

**Why:** The deck specifies a 6-step process; the shipped flow + marketing copy
use a 4-step ("Intake → Curate → Connect → Follow Through").

**Deck's 6 steps (use this exact language):**
1. Intake & Profiling
2. Discovery Calls
3. Curated Matching
4. Introduction Emails
5. Bilateral Confirmation
6. Pre-Scheduled Agenda

**Where:** the "How it works" copy on `/deal-network` (`src/pages/DealNetwork.jsx`)
and any step labels in the apply flow / portal. This is mostly copy + a step list,
but "Discovery Calls" and "Bilateral Confirmation" are new concepts to reflect.

**Effort:** small–medium (copy + a step component).

---

## 3. Deal Network — mirror the Hybrid Deck on /deal-network (C4) + deck-language pass

**Why:** The public `/deal-network` marketing page should mirror the deck
structure and language. The deck is the bible.

**Deck section order to mirror:**
Overview → Why the Deal Network → The Two Sides + **Capital & Impact Layer** →
Core Offerings (Curated Deal Facilitation / Roundtables & Deal Lunches /
Year-Round Engagement) → How It Works (6 steps, see #2) → The Two Experiences
(Companies vs Rightsholders) → The Timeline (~6 wk before → event week → post-event)
→ How to Join (3 tracks: Rightsholders invited/free, Companies included-with-package,
Capital & Impact apply-to-join).

**Plus a deck-language pass** across Deal Network surfaces (apply flow, portal,
copy) so terminology matches the deck exactly.

**Where:** `src/pages/DealNetwork.jsx` (708 lines, currently the marketing page,
no form — CTAs already point at `/deal-network/apply`).

**Effort:** larger copy + layout rebuild. Best done after C1/C2 so the third track
+ 6 steps are real when the page references them.

---

## 4. Speaker profiles — image gating + backend notification (F2 proper)

Three linked pieces. The quick fix (homepage "View all past speakers" → the local
headshot grid) is already live; this is the proper, backend-driven version.

**4a. Crawl + download real past-speaker headshots (#61).**
Source from `soccerex.com` (esp. Miami pages). Download into
`Soccerex-front/public/images/...` and map to speaker records.

**4b. Gate imageless profiles on public event pages (#62).**
No public-facing event page should show a speaker profile that has no image —
reserve those until an image exists. Read speakers from the backend
(`GET /api/v1/events/{slug}/speakers`); the page is `src/pages/EventSpeakers.jsx`
(+ `EventSpeakerProfile.jsx`). Filter out records with no `photo`/`image`.

**4c. Backend notification for display-blocked profiles (#63).**
When a profile wants public display but is blocked by a factor (e.g. missing
image), surface it to the team — an admin notification / Filament surface in
`Soccerex-back` so blocked profiles are visible, not silently hidden.

**Effort:** 4a = asset gathering; 4b = small frontend; 4c = backend (Filament +
notification). 4b depends on 4a for the actual images.

---

## 5. Miami registration section → 3 blocks (#51)

**Why:** The v4 doc restructures the Miami registration/ticket section into three
blocks: **Delegate Registration** (REGISTER NOW), **Sponsorship & Partnership**
(EXPLORE PARTNERSHIP OPPORTUNITIES), **Rightsholder Access** (APPLY FOR
RIGHTSHOLDER PASS). Doc also asks "shouldn't we have a button to sponsor as well?"
— yes, fold into the Sponsorship block.

**Where:** `src/pages/Miami2026.jsx`, the existing tickets/registration section
(currently "Get your tickets to Soccerex Miami" with General + Rightsholder
eventify links). Keep the eventify links:
- General tickets: `https://soccerexmiami2026.eventify.io/t2/tickets/`
- Rightsholder: `https://soccerexmiami2026.eventify.io/t2/tickets/79DF37`

**Effort:** small frontend layout rebuild (no backend). The borderline "simple"
item — left out of the last copy batch because it's a section restructure, not a
text swap.

---

## Done this round (for reference)
- About v4 copy (hero/mission/core-values/discover/who-we-reach/timeline, delete Deals-That-Got-Done)
- Riyadh v4 copy (anchor-event hero, themes w/ descriptions, why-attend, request-access)
- C3 `?track=` entry param on the Deal Network apply flow
- Homepage / Events / Global Network v4 copy
- Deal Network capability grid + side confirmation + pain points (apply flow)
- Deal Network backend: Option A multi-stakeholder submit, application-received mailable, reply-to config
- Insights blank-space fix, article white-on-white fix, article "CTA" placeholder filter (+ backend strip command)
- Homepage globe spacing, speaker-list link fix, Mac photo removal
