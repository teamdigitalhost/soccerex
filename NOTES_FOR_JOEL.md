# Deal Network build — notes for Joel

Built overnight 2026-05-12. Both phases shipped and pushed. Walk through `?test=1` before flipping the test mode in customer messaging.

## What landed

### Public intake — `/deal-network`
- New page replaces the old (un-routed) landing draft.
- Hero matches the dark/gold Soccerex inner-hero pattern used on Contact.
- Single long page, five concierge sections (identity, objectives, geo+budget, event, context). Only 4 required fields (side, company name, your name, email).
- 4 visible side options collapsed to the backend's 3: brand & agency → `company`, rights holder → `rightsholder`, both → `both`. The agency mapping is a judgment call — see "Decisions worth a sanity check" below.
- Confirmation view is a separate full-screen state (not a toast). Premium tone: "Thank you. The Soccerex team takes it from here." Shows the backend `data.id` as a reference number when present.
- Supporting files: paste-link only (per backend handoff), helper text steers users to Dropbox/Drive/WeTransfer instead of uploads.
- "Already in the network? Sign in to your Deal Network portal" link at the bottom — pulls them to `/profile-access` if they came in here by mistake.

### Authenticated portal section
- New component `src/components/DealNetworkPortalSection.jsx`, embedded inside `CompanyPortal` directly under the existing profile-summary/next-actions cards.
- Sections rendered as concierge cards (not tables):
  - Membership status (tier, status, meeting entitlement, match count)
  - Briefs ("What you are looking for") — expandable rows, edit pencil, "Add another brief"
  - Curated matches ("Introductions Soccerex is reviewing") — counterpart name, fit-score chip, rationale, intro angle
  - Meetings — accept / tentative / decline + an optional short note before responding
  - Footer guidance if backend returns `guidance.concierge` / `guidance.large_files`
- Intake editor is a modal (not a side panel), reusing the same chip group + select styling as the public intake for visual continuity.
- Empty states use the exact copy in the brief, e.g. "Soccerex is reviewing your criteria. Curated introductions will appear here once the team identifies strong fits."
- After every mutation the section reloads the whole portal payload (`getDealNetworkPortal`). Cheaper than tracking each sub-tree.

### Plumbing
- `src/lib/soccerexApi.js`:
  - `submitDealNetworkIntake(payload, opts)` — public
  - `getDealNetworkPortal(slug, token, opts)`
  - `submitDealNetworkPortalIntake(slug, token, payload, opts)`
  - `updateDealNetworkPortalIntake(slug, token, intakeId, patch, opts)`
  - `respondToDealNetworkMeeting(slug, token, meetingId, body, opts)`
  - All thread `test` via `withTestParam` — `?test=1` survives every hop.
- `src/lib/routes.js` — new `DEAL_NETWORK = '/deal-network'` constant.
- `src/App.jsx` — route registered as `<Route path={DEAL_NETWORK} element={<DealNetworkPage />} />` with `lazy()` split.
- Navbar gets a "Deal Network" link between "Network" and "Insights".
- Footer Explore column gets a "Deal Network" entry between Global Network and Insights.

## Decisions worth a sanity check

1. **Agency side mapping.** The brief asked for 4 visible side options. The backend only stores 3 (`company` / `rightsholder` / `both`). I mapped "agency / service provider" to `company` since agencies buy introductions for clients. If you'd rather route agencies to `both` so the concierge team treats them as multi-directional, change `SIDE_OPTIONS[2].backendValue` in `src/pages/DealNetwork.jsx` from `'company'` to `'both'`. Trivial flip.

2. **Where the Deal Network portal lives.** I attached it to `CompanyPortal` (the existing company dashboard at `/profile-access/portal/{slug}`), not to `PersonalPortal` and not to `ProfileEditor`. This matches the brief's "Add a Deal Network tab/section alongside Profile, Assets, Sponsor Portal." It will only render for profiles whose magic link routes them to the company portal. If the backend wants Deal Network to also surface for person-type profiles, we can lift the component into a third location. Worth deciding when we know who's actually allowed in the network.

3. **No standalone Deal Network portal page.** I didn't create `/deal-network/portal/{slug}`. The current pattern is one portal page per profile kind, and Deal Network sits inside the relevant one. If you ever want a dedicated full-screen Deal Network dashboard (calendar-style, conference-week view), it's straightforward to spin out — the component is already self-contained.

4. **Supporting files = paste-link only.** Per the backend handoff, I did NOT add a file uploader to the public intake. The "Supporting files" textarea takes shared links (Dropbox / Drive / WeTransfer / Box / Notion). Backend doesn't have a Deal-Network-specific upload endpoint and the handoff explicitly says not to make one yet.

5. **Where the file-links live in the payload.** Backend doesn't have a `file_links` field. To avoid losing the data I'm appending the pasted links to the `sensitivities` field with a `"Shared files: …"` prefix. The concierge team will see them in context with the brief. If you'd rather route them elsewhere, this is the only spot in `DealNetwork.jsx` where it gets folded in (look for `sensitivitiesCombined`).

6. **Reuse vs separate components.** The intake editor inside the portal section is a smaller, business-style modal with just the fields a member would update. The public intake is the full concierge form. Different audiences, intentional split.

## Test mode

All API calls thread `?test=1` via `isTestModeFromUrl()` + `withTestParam()`. Confirmed by reading the call sites; not yet confirmed live. To smoke-test:

- `https://soccerex1.netlify.app/deal-network?test=1` — submit a brief, watch the network tab, confirm `?test=1` is on `POST /api/v1/deal-network/intakes`.
- Generate a magic link for one of the seeded UX TEST profiles:
  ```bash
  cd ~/iCloud/Sites/Soccerex-back
  php artisan profile-access:link joel@digitalhost.co --test --profile=ux-test-delete-palm-tech-labs --ttl=60
  ```
  Sign in, land on the company portal, scroll past Profile / Next actions — the Deal Network section sits there. Submit a brief, edit it, respond to the seeded meeting.

## Things I deliberately did NOT do

- **TestModeBanner update** — the existing banner already covers Deal Network because it watches the URL. Nothing to change.
- **Loading the portal eagerly on first paint of CompanyPortal** — the section fetches on mount, but in parallel with the rest of the dashboard. So nothing else waits on it.
- **Adding a deal-network sub-route to `ROUTE_PATTERNS`** — only the public top-level route was needed. No params.
- **A separate UX for "I have no membership yet" vs "I have a brief in flight"** — handled by the BriefsCard empty state. The "Add a brief" CTA effectively opts the user into the network when they submit. The backend creates the membership.
- **Linking to /deal-network from the Home/Contact CTAs** — felt out of scope. Worth adding once the page has been QA'd in production.
- **A separate marketing landing for the Deal Network** — the page IS the landing. "How it works" lives inline above the form. If you want a longer marketing page eventually, lift `<HeroSection>` + `<HowItWorks>` out into `/deal-network/about` and keep the form on `/deal-network/apply`.
- **Stripping the agency-as-company mapping into a true 4-way side** — would require a backend conversation. The frontend just collapses cleanly today.

## Open follow-ups

- Add a one-line homepage tile or sub-hero pointing at /deal-network once you're happy with the page.
- Decide if the Deal Network should appear inside PersonalPortal as well (it currently only renders inside CompanyPortal).
- Verify the backend `guidance.large_files` / `guidance.concierge` strings render the way you want — if they're long, the `GuidanceFooter` may need its own card treatment.
- If conversion is lower than expected, A/B the side selector against a simpler "Brand vs. Property" two-option layout.

That's it. Both builds are pushed and live (backend `f30477d`, frontend will be deployed by Netlify on push to main). Sleep well — JC.
