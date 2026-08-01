/**
 * Deal Network campaign attribution carried in from an invite CTA.
 *
 * A tracked CTA click lands the visitor on a URL holding two values:
 *
 *   /deal-network/apply?track=rightsholder&sx=<opaque per-send click token>
 *
 * ?sx= names the exact send, so a signup can be credited to the email that produced it instead
 * of reading as organic traffic; ?track= names the cohort that email pitched (brands,
 * rightsholders, capital) and presets the form. Both ride along on every API call the apply
 * flow makes.
 *
 * WHY THIS IS PERSISTED AT ALL. The URL loses the values almost immediately: the apply flow
 * emails a magic link, and clicking it opens a fresh page at /deal-network/apply?token=... with
 * neither value present. Without a stored copy the conversion, which is the final submit several
 * steps later, would arrive bare.
 *
 * WHY IT HAS ITS OWN KEY. Deliberately NOT the shared 'sx_click_token' that App.jsx and
 * LeadForm.jsx use. Two reasons, both of them bugs if ignored: clearing that shared key on a
 * Deal Network submit would silently strip attribution from the site-wide lead form, and reading
 * it would resurrect a stale token straight after we cleared our own, which is exactly the
 * shared-browser leak the clearing exists to prevent.
 *
 * WHY IT EXPIRES AND CLEARS. A stored token that lives forever eventually credits an unrelated
 * third party on a shared machine to someone else's click. So the copy carries a deadline, and
 * a completed submit wipes it: that application is over, and the next person to use this browser
 * starts clean.
 *
 * Everything here is best-effort by design. The backend keeps its own copy on the apply attempt
 * and that is the real carrier (it survives a magic link opened on another device, where no
 * browser storage can help). Storage being unavailable, full or disabled must never break a
 * signup, so every access is guarded and every failure degrades to "unattributed".
 */

const STORAGE_KEY = 'sx_dn_attribution'

/**
 * How long a click stays creditable. Long enough for the realistic path (click the invite,
 * think about it, come back and apply a few days later), short enough that a shared or public
 * browser is not still crediting a stranger weeks on. The server-side copy on the apply attempt
 * is what carries a single in-progress application, so this window does not need to be generous
 * to protect the common case.
 */
// Two hours, not seven days. This is a single sitting: click the email, fill the form, submit. The
// only thing a long window buys is the shared-browser leak, where somebody abandons an application
// on a shared machine and the next person to apply is credited to a stranger's click. An applicant
// who comes back tomorrow still has the email, and clicking it again re-stamps the token.
const TTL_MS = 2 * 60 * 60 * 1000

/** Tokens are minted as 24 alphanumerics. Anything else is not one, so do not store or send it. */
const TOKEN_PATTERN = /^[A-Za-z0-9]{16,32}$/

/** Cohort slugs the invite CTAs actually use. An unrecognised ?track= is dropped, not guessed at. */
const KNOWN_TRACKS = [
  'brand', 'company',
  'rightsholder', 'property',
  'capital', 'investor', 'impact',
]

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const saved = JSON.parse(raw)
    /* Past its deadline is the same as absent, and takes the stale copy with it. */
    if (!saved || typeof saved !== 'object' || !(saved.exp > Date.now())) {
      clearCampaignAttribution()
      return null
    }
    return { sx: String(saved.sx || ''), track: String(saved.track || '') }
  } catch {
    /* Unreadable or corrupt: treat as organic rather than letting it throw into the flow. */
    return null
  }
}

function persist(value) {
  if (!value.sx && !value.track) return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...value, exp: Date.now() + TTL_MS }))
  } catch { /* private mode / storage full: the backend copy still carries it */ }
}

/**
 * Read ?sx and ?track from the current URL, persist anything new, and return the best values
 * known for this browser. The URL wins over storage, so a fresh click always re-attributes.
 *
 * Values are sanitised here as well as on the server, so a junk token is simply never sent.
 * Nothing in this function rejects: an unusable value is dropped and the flow carries on.
 *
 * @param {URLSearchParams} [params] the page's search params (defaults to window.location)
 * @returns {{ sx: string, track: string }}
 */
export function readCampaignAttribution(params) {
  let search = params
  if (!search) {
    try {
      search = new URLSearchParams(typeof window === 'undefined' ? '' : window.location.search)
    } catch {
      search = new URLSearchParams('')
    }
  }

  let sx = ''
  let track = ''
  try {
    const rawSx = (search.get('sx') || '').trim()
    if (TOKEN_PATTERN.test(rawSx)) sx = rawSx

    const rawTrack = (search.get('track') || '').trim().toLowerCase()
    if (KNOWN_TRACKS.includes(rawTrack)) track = rawTrack
  } catch { /* a malformed query string is not a reason to fail a signup */ }

  // Only a REAL click token starts or replaces a stored attribution. An in-app Apply button carries
  // ?track= but no ?sx=, and persisting that used to overwrite a genuine invite token with an empty
  // one, permanently destroying the credit for an applicant who arrived from Ivan's email.
  if (sx) {
    persist({ sx, track })
    return { sx, track }
  }

  // A bare ?track= refines the cohort only when we already hold that person's click token.
  if (track) {
    const stored = readStored()
    if (stored?.sx) {
      persist({ sx: stored.sx, track })
      return { sx: stored.sx, track }
    }
    return { sx: '', track }
  }

  return readStored() || { sx: '', track: '' }
}

/**
 * Forget the stored click. Called once an application is submitted: that conversion is recorded,
 * and leaving the token behind would credit the next person on this browser to someone else's
 * click.
 */
export function clearCampaignAttribution() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch { /* nothing stored is the desired end state anyway */ }
}

/**
 * The same values shaped for an API body, with empty values dropped so a request from an organic
 * visitor is byte-for-byte what it was before attribution existed.
 *
 * @param {{ sx?: string, track?: string }} [attribution]
 * @returns {{ sx?: string, track?: string }}
 */
export function campaignAttributionPayload(attribution) {
  const { sx, track } = attribution || readCampaignAttribution()
  const out = {}
  if (sx) out.sx = sx
  if (track) out.track = track
  return out
}
