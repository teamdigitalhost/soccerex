# Soccerex website — remaining work backlog

**Last updated:** 2026-06-04
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

## 1. Deal Network third track: Capital & Impact Partners (C1) ✅ DONE 2026-06-04

**Built and verified (tests + frontend build); NOT yet deployed.** Capital is now
a first-class third matched side (`SIDE_CAPITAL`), not folded into Brand.

Decision made: capital is a **new side**, not a member_type or tag. Note the prior
"enum" assumption was wrong: `Membership.side` is a `VARCHAR(32)`, so adding
`capital` needed **no migration**.

- Backend: `Membership::SIDE_CAPITAL = 'capital'` in `SIDES`; both intake
  controllers normalize capital aliases and set `meeting_entitlement = 0`
  (concierge-scheduled, like rightsholders); matching workspace left column now
  includes capital so capital firms pair against rightsholders via the existing
  scorer; Filament badge/filter; demo seeder gains a capital firm + curated match.
- Frontend: `CAPABILITY_VALIDITY` gained a `capital` column (provides
  investment/advisory, both on M&A + infrastructure); third "Capital & Impact"
  selector in `DealNetworkApply.jsx`; `SIDE_TO_BACKEND.capital = 'capital'`;
  `?track=capital` no longer folds to Brand; capital-aware labels (ticket bands,
  deal structures, mandate/thesis); per-track apply CTAs on `/deal-network`.
- Tests: full DN suite green (29 passed) incl. a capital intake test.
- Full design + rationale: the stakeholder proposal
  `~/Downloads/Soccerex-Deal-Network-Intake-Architecture.{docx,pdf}` and memory
  `project_soccerex_intake_architecture.md`.

---

## 2. Deal Network 6-step process (C2) ✅ DONE

The deck's exact 6 steps (Intake & Profiling, Discovery Calls, Curated Matching,
Introduction Emails, Bilateral Confirmation, Pre-Scheduled Agenda) are live in the
"How it works" section of `/deal-network` (`src/pages/DealNetwork.jsx`).

---

## 3. Deal Network mirror the Hybrid Deck on /deal-network (C4) ✅ DONE (overview level)

`/deal-network` now mirrors the deck at an **overview level by explicit
direction** ("I don't need the whole deck on the page, just an overview"): the
three participation tracks (Rightsholders invited/free, Companies "Available to
Sponsors & Exhibitors", Capital & Impact apply-to-join, each with a per-track
apply CTA) and the 6-step process. The full section-by-section deck mirror was
intentionally NOT built. Deck language is reflected across the apply flow.

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

## 6. Domain migration to soccerex.com (launch-gated)  ⬅ added 2026-06-03

**Why:** Move the public site off `soccerex1.netlify.app` onto `soccerex.com`. Two
possible paths, decide first: (A) simple Netlify custom-domain re-point (React stays
on Netlify, backend stays at `soccerex.digitalhost.co`), or (B) the full
consolidation described in `Soccerex-back/FRONTEND_MIGRATION_PLAN.md` (React folded
into Laravel, split into `soccerex.com` public + `system.soccerex.com` backend).

**Risk factors (from the 2026-06-03 audit):**
- `soccerex.com` apex currently carries the company's Microsoft 365 email (MX) plus
  the SES sending subdomains `news.` / `mail.`. Change ONLY the website-serving
  records (apex A/ALIAS + www CNAME). Never touch MX or the `news.` / `mail.`
  records, or both company email and the email-sending platform break.
- `soccerex.com` appears to still serve a WordPress site (the insights manifest pulls
  images from `soccerex.com/wp-content/...`). Confirm what is live there before DNS flip.
- The frontend has zero hardcoded netlify URLs, so the React app needs no domain
  change for path A. The dependencies are all backend: `CORS_ALLOWED_ORIGINS`,
  `SOCCEREX_FRONTEND_URL`, and two hardcoded `soccerex1.netlify.app` fallbacks
  (`config/services.php:63`, `app/Services/PlatformConfiguration.php:18`) to repoint.

**Where:** DNS + Laravel Cloud env vars + the two backend fallbacks. No frontend code
change for path A. Full runbook + risk table in the 2026-06-03 session audit.

**Effort:** small for path A (DNS + env + 2 config edits + verify), large for path B.

**Trigger:** do not execute until the public frontend is declared ready and DNS,
Laravel Cloud, and Netlify changes can be coordinated in one launch window.

---

## Done this round (for reference)
- Deal Network third matched side: Capital & Impact (`SIDE_CAPITAL`) end-to-end (C1) — built + tested, pending deploy
- Deal Network 6-step process live on `/deal-network` (C2)
- Deal Network `/deal-network` deck mirror at overview level + 3 participation tracks with per-track apply CTAs (C4)
- Deal Network apply-redesign spec updated to as-built (`docs/superpowers/specs/2026-05-28-deal-network-apply-redesign-design.md`)
- About v4 copy (hero/mission/core-values/discover/who-we-reach/timeline, delete Deals-That-Got-Done)
- Riyadh v4 copy (anchor-event hero, themes w/ descriptions, why-attend, request-access)
- C3 `?track=` entry param on the Deal Network apply flow
- Homepage / Events / Global Network v4 copy
- Deal Network capability grid + side confirmation + pain points (apply flow)
- Deal Network backend: Option A multi-stakeholder submit, application-received mailable, reply-to config
- Insights blank-space fix, article white-on-white fix, article "CTA" placeholder filter (+ backend strip command)
- Homepage globe spacing, speaker-list link fix, Mac photo removal
