/**
 * Page titles, descriptions and preview images for every route, in one place.
 *
 * Two readers:
 *   - PageMeta (src/components/PageMeta.jsx) renders these tags in the browser.
 *   - The social-meta edge function (netlify/edge-functions/social-meta.js) writes the
 *     same tags into the HTML before Netlify sends it. Link unfurlers (Facebook,
 *     LinkedIn, iMessage, Slack, WhatsApp, X) never run the app's JavaScript, so without
 *     it every shared link would show the defaults in index.html.
 *
 * The edge function runs on Deno, so this file stays plain JavaScript: no JSX, no
 * import.meta.env, and every relative import names its .js extension.
 *
 * Copy here is public-facing: American English, and no em or en dashes.
 */
import {
  HOME, ABOUT, EVENTS, CONTACT, GLOBAL_NETWORK, GALLERY, PAST_SPEAKERS, APP_PAGE,
  DEAL_NETWORK, DEAL_NETWORK_APPLY, RITZ_DRAWING, HERSOCCEREX, INSIGHTS,
  MIAMI_2026, MIAMI_2026_V2, MIAMI_2026_PRESS_RELEASE, MIAMI_2026_ATTENDEE_GUIDE,
  MIAMI_2026_PRICING, MIAMI_2026_ACCOMMODATIONS,
  MIAMI_2026_ACCOMMODATIONS_MISSPELLED, MIAMI_2026_SPONSOR, MIAMI_2026_EXHIBIT,
  EUROPE_2026, RIYADH_2027, ACCOMMODATIONS, ACCOMMODATIONS_MISSPELLED, BOOK,
  SPONSOR, EXHIBIT, EXHIBITOR, SPONSORSHIP, AGENDA_COLLAB, PROFILE_ACCESS, PROFILE_SHORTCUT,
  PRIVACY_POLICY, TERMS, COOKIE_POLICY, REFUND_POLICY,
  eventAgenda, eventSpeakers, eventAgendaConcept, eventSpeaker, eventRecap, eventRsvp,
  insightArticle, partnerLanding, pressRelease,
} from './routes.js'
import { RECENT } from '../data/recentEvents.js'
import { PRESS_RELEASES } from '../data/pressReleases.js'

export const SITE_URL = 'https://soccerex.com'
const SITE_NAME = 'Soccerex'

/* Preview images cut to 1200x630 by scripts/og-images.sh. Sizing them for the card,
   rather than pointing at a full-size hero, keeps them under WhatsApp's size limit
   and lets Facebook draw the card on the first share. */
const OG_DIR = '/images/og/'
const og = (name) => `${OG_DIR}${name}.jpg`
const DEFAULT_IMAGE = '/images/soccerex-og-default.jpg'

/* Mirrors the static tags in index.html, which are what a crawler sees if the edge
   function is ever bypassed. Change both together. */
export const DEFAULT_META = {
  title: 'Soccerex: 30 Years at the Center of the Business of Football',
  description: 'Since 1996, Soccerex has brought together the clubs, leagues, brands, and investors who drive the global game, at events in Miami, Europe, and the Middle East.',
  image: DEFAULT_IMAGE,
}

const MIAMI_WHEN = 'Nu Stadium, Miami, September 23 to 25, 2026'

/* Routes whose meta is fixed. Keys are exact paths. */
const PAGES = {
  [HOME]: DEFAULT_META,
  [ABOUT]: {
    title: 'About Soccerex | 30 Years at the Center of Football Business',
    description: 'Since 1996, Soccerex has been where football business leaders meet: club owners, league executives, investors, and brands, at events in Miami, Europe, and the Middle East.',
    image: og('about'),
  },
  [EVENTS]: {
    title: 'Soccerex Events | Miami 2026 and Beyond',
    description: 'Soccerex Miami 2026 takes over Nu Stadium, September 23 to 25. See the events ahead and look back at past Soccerex events in Miami, Europe, and the Middle East.',
    image: og('events'),
  },
  [CONTACT]: {
    title: 'Contact Soccerex',
    description: 'Tell us whether you want to partner, speak, cover an event, or volunteer, and we will send your message to the right person at Soccerex.',
  },
  [GLOBAL_NETWORK]: {
    title: 'The Soccerex Global Network | Where Football Business Gets Done',
    description: 'For 30 years Soccerex has connected the global football industry. Today that network works all year, turning introductions into partnerships and investment.',
    image: og('global-network'),
  },
  [GALLERY]: {
    title: 'Gallery | 30 Years of Soccerex',
    description: 'Moments from three decades of Soccerex events, bringing the football world together in Miami, Europe, and beyond.',
    image: og('gallery'),
  },
  [PAST_SPEAKERS]: {
    title: 'Past Speakers | Soccerex',
    description: 'Presidents, commissioners, owners, and legends of the game: some of the voices who have taken the Soccerex stage across three decades and 57 events.',
    image: og('past-speakers'),
  },
  [APP_PAGE]: {
    title: 'The Official Soccerex Events App',
    description: 'Schedules, speaker details, and networking for Soccerex events, on iPhone and Android.',
    image: og('app'),
  },
  [DEAL_NETWORK]: {
    title: 'Soccerex Deal Network | Curated Access, Commercial Outcomes',
    description: 'An invite-driven network built on 30 years of Soccerex relationships, connecting rightsholders, brands, and capital partners with the decision-makers they need to meet.',
    image: og('deal-network'),
  },
  [DEAL_NETWORK_APPLY]: {
    title: 'Apply to the Soccerex Deal Network',
    description: 'Apply to join the Soccerex Deal Network as a rightsholder, a company, or a capital partner.',
    image: og('deal-network'),
  },
  [RITZ_DRAWING]: {
    title: 'Ritz-Carlton Drawing Official Terms | Soccerex Miami 2026',
    description: 'Official terms for the drawing of a three-night stay at the Ritz-Carlton South Beach among the first 100 completed Soccerex Deal Network applications.',
    image: og('ritz-drawing'),
  },
  [HERSOCCEREX]: {
    title: 'HerSoccerex | Soccerex',
    description: 'HerSoccerex brings together women who influence the game, women building their careers and the allies who can open doors for both, in collaboration with Wellness Universe Corporate.',
    image: '/images/hersoccerex/og.jpg',
  },
  [INSIGHTS]: {
    title: 'Soccerex Insights | The Business of Football',
    description: 'Analysis and opinion on the business of football, from investment and media rights to technology and the women\'s game.',
  },
  [MIAMI_2026]: {
    title: 'Soccerex Miami 2026 | Nu Stadium, September 23 to 25',
    description: 'The global football business event returns to the Americas. Clubs, leagues, investors, and brands meet at Nu Stadium in Miami, September 23 to 25, 2026.',
    image: og('miami-2026'),
  },
  [MIAMI_2026_ATTENDEE_GUIDE]: {
    title: 'Attendee Guide | Soccerex Miami 2026',
    description: 'Getting to Nu Stadium, where to park, what happens when you arrive, and what is on each day of Soccerex Miami 2026, September 23 to 25.',
    image: og('attendee-guide'),
  },
  [MIAMI_2026_PRESS_RELEASE]: {
    title: 'Press Release: Soccerex Miami 2026 at Nu Stadium | Soccerex',
    description: 'Soccerex brings its flagship global gathering to Nu Stadium at Miami Freedom Park, September 23 to 25, 2026.',
    image: og('miami-2026'),
    type: 'article',
  },
  [ACCOMMODATIONS]: {
    title: 'Accommodations | Soccerex Miami 2026',
    description: 'Partner hotels for Soccerex Miami delegates: an oceanfront pick on South Beach, three airport hotels close to Nu Stadium with free shuttles, and a group rate in Wynwood.',
    image: og('accommodations'),
  },
  [SPONSOR]: {
    title: 'Sponsor Soccerex Miami 2026 | Partnership Opportunities',
    description: `Put your brand in front of football's decision-makers at ${MIAMI_WHEN}. Headline sponsorships and bespoke partnership packages are available.`,
    image: og('sponsor'),
  },
  [EXHIBIT]: {
    title: "Exhibit at Soccerex Miami 2026 | Reach Football's Buyers",
    description: `Show your product or service to 1,500+ football industry professionals at ${MIAMI_WHEN}. Floor stands and branded spaces are available.`,
    image: og('exhibit'),
  },
  [EUROPE_2026]: {
    title: 'Soccerex Europe 2026 | Johan Cruijff ArenA, Amsterdam',
    description: 'Thank you to everyone who joined us in Amsterdam for two days of executive content, networking, and brand activations at the Johan Cruijff ArenA.',
    image: og('europe-2026'),
  },
  [PRIVACY_POLICY]: {
    title: 'Privacy Policy | Soccerex',
    description: 'How Soccerex collects, uses, and protects your personal information.',
  },
  [TERMS]: {
    title: 'Terms and Conditions | Soccerex',
    description: 'The terms that apply when you use soccerex.com and attend Soccerex events.',
  },
  [COOKIE_POLICY]: {
    title: 'Cookie Policy | Soccerex',
    description: 'The cookies soccerex.com uses and how to control them.',
  },
  [REFUND_POLICY]: {
    title: 'Refund Policy | Soccerex',
    description: 'The Soccerex refund policy for event passes and bookings.',
  },
  [AGENDA_COLLAB]: {
    title: 'Agenda Review | Soccerex',
    description: 'Review the draft Soccerex program and add your suggestions.',
  },
}

/* Paths the app forwards somewhere else (a <Navigate> in App.jsx). A crawler never
   follows that, so it gets the destination's card. */
const ALIASES = {
  [MIAMI_2026_V2]: MIAMI_2026,
  [MIAMI_2026_PRICING]: MIAMI_2026,
  [ACCOMMODATIONS_MISSPELLED]: ACCOMMODATIONS,
  [BOOK]: ACCOMMODATIONS,
  [MIAMI_2026_ACCOMMODATIONS]: ACCOMMODATIONS,
  [MIAMI_2026_ACCOMMODATIONS_MISSPELLED]: ACCOMMODATIONS,
  [MIAMI_2026_SPONSOR]: SPONSOR,
  [SPONSORSHIP]: SPONSOR,
  [MIAMI_2026_EXHIBIT]: EXHIBIT,
  [EXHIBITOR]: EXHIBIT,
  [RIYADH_2027]: EVENTS,
}

/* Personal links (sent by email, one per person). They get a plain title of their
   own rather than the home page card. Matched by prefix. */
const PERSONAL = [
  [PROFILE_ACCESS, { title: 'Your Soccerex Profile', description: 'Edit your Soccerex profile and manage your event details.' }],
  [PROFILE_SHORTCUT, { title: 'Your Soccerex Profile', description: 'Edit your Soccerex profile and manage your event details.' }],
  ['/invite/', { title: 'Your Soccerex Invitation', description: 'You have been invited to manage a Soccerex profile.' }],
  ['/schedule/', { title: 'Book a Call with Soccerex', description: 'Pick a time for a call with the Soccerex team.' }],
  ['/speak', { title: 'Speaking at Soccerex', description: 'Reply to your invitation to speak at a Soccerex event.' }],
  ['/profile-preview/', { title: 'Profile Preview | Soccerex', description: 'A preview of a Soccerex profile update.', noindex: true }],
  ['/article-preview/', { title: 'Article Preview | Soccerex', description: 'A preview of a Soccerex article draft.', noindex: true }],
]

/* Preview image for pages that belong to one event (its agenda, speakers, partner pages). */
const EVENT_IMAGES = {
  'soccerex-miami-2026': og('miami-2026'),
  'soccerex-europe-2026': og('europe-2026'),
}
const eventImage = (slug) => EVENT_IMAGES[slug] || DEFAULT_IMAGE

/** Meta for a route with fixed meta, ready to spread into <PageMeta />. */
export function pageMeta(path) {
  return { ...(PAGES[path] || DEFAULT_META), path }
}

/**
 * Meta for any path that needs no API call: fixed pages, their aliases, past-event
 * recaps, press releases and personal links. Null when the path needs the API or is
 * unknown.
 */
export function staticMetaFor(pathname) {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  const key = path.toLowerCase()
  if (PAGES[key]) return pageMeta(key)
  if (ALIASES[key]) return pageMeta(ALIASES[key])
  if (key.startsWith(`${MIAMI_2026_PRICING}/`)) return pageMeta(MIAMI_2026)

  const release = key.startsWith('/press/') && PRESS_RELEASES[decodeSegment(path.slice('/press/'.length))]
  if (release) return pressReleaseMeta(path.slice('/press/'.length), release)

  const recap = RECENT.find((e) => e.slug && `/${e.slug}` === key)
  if (recap) return recapMeta(recap)

  const personal = PERSONAL.find(([prefix]) => key === prefix || key.startsWith(prefix.endsWith('/') ? prefix : `${prefix}/`))
  if (personal) return { ...personal[1], path }
  return null
}

export function recapMeta(event) {
  return {
    title: event.name,
    description: event.summary,
    image: og(event.slug),
    path: eventRecap(event.slug),
  }
}

export function pressReleaseMeta(slug, release) {
  const lead = release.content.find((b) => b.type === 'p' && !b.bold)
  return {
    title: `${release.title} | Soccerex`,
    description: plainText(lead?.text, 200),
    image: release.image,
    path: pressRelease(slug),
    type: 'article',
  }
}

/* ─── Pages built from API data ────────────────────────────────────────────
   Each builder takes the payload the page already fetches, so the page and the edge
   function describe it the same way. */

/** An insight article: { slug, title, description, image } from the CMS or the legacy manifest. */
export function articleMeta({ slug, title, description, image }) {
  return {
    title: withSuffix(title || 'Insights', 'Soccerex Insights'),
    description: plainText(description, 200) || 'Read the latest insights from Soccerex on the business of football.',
    image: image || DEFAULT_IMAGE,
    path: insightArticle(slug),
    type: 'article',
  }
}

/* An article held behind a shared password before its announcement. The headline is
   the announcement, so the card says nothing about it. */
export function lockedArticleMeta(slug) {
  return {
    title: SITE_NAME,
    description: 'This page is available to invited readers.',
    path: insightArticle(slug),
    noindex: true,
  }
}

/** An event's agenda, speakers or program themes page. `kind`: 'agenda' | 'speakers' | 'themes'. */
export function eventPageMeta(kind, event, slug) {
  const name = event?.name || SITE_NAME
  const when = eventWhen(event)
  const past = isPastEvent(event)
  const pages = {
    agenda: {
      title: `Agenda | ${name}`,
      description: `Every session ${past ? 'from' : 'at'} ${name}, by day and stage${when ? `, ${when}` : ''}.`,
      path: eventAgenda(slug),
    },
    speakers: {
      title: `Speakers | ${name}`,
      description: past
        ? `The speakers who took the stage at ${name}${when ? `, ${when}` : ''}.`
        : `Meet the speakers at ${name}${when ? `, ${when}` : ''}.`,
      path: eventSpeakers(slug),
    },
    themes: {
      title: `Program Themes | ${name}`,
      description: `The topics shaping the ${name} program, with a place to suggest a speaker or pitch a session of your own.`,
      path: eventAgendaConcept(slug),
    },
  }
  return { ...pages[kind], image: eventImage(slug) }
}

/** One speaker's profile page. The photo is a headshot, so the card is the square kind. */
export function speakerMeta(speaker, eventSlug) {
  const event = speaker.event || {}
  const name = event.name || SITE_NAME
  const when = eventWhen(event)
  const role = [speaker.headline, speaker.company]
    .filter(Boolean)
    .filter((part, i, parts) => i === 0 || !parts[0].includes(part))
    .join(', ')
  const appearance = `${isPastEvent(event) ? 'Spoke' : 'Speaking'} at ${name}${when ? `, ${when}` : ''}.`
  return {
    title: `${speaker.display_name} | ${name}`,
    description: role ? `${stripFinalStop(role)}. ${appearance}` : appearance,
    image: speaker.photo_url || eventImage(eventSlug),
    card: speaker.photo_url ? 'summary' : undefined,
    path: eventSpeaker(eventSlug, speaker.slug),
    type: 'profile',
  }
}

/** A co-branded partner referral page. */
export function partnerMeta(partner, slug) {
  const event = partner.event
  return {
    title: `${partner.name} at ${event?.name || SITE_NAME} | Soccerex`,
    description: plainText(partner.subheadline || partner.headline, 200),
    image: eventImage(event?.slug),
    path: partnerLanding(slug),
  }
}

/** The landing page an email CTA button links to. */
export function ctaMeta(cta, slug) {
  return {
    title: cta?.title ? `${cta.title} | Soccerex` : SITE_NAME,
    description: plainText(cta?.body, 200) || DEFAULT_META.description,
    image: cta?.image_url || DEFAULT_IMAGE,
    path: `/cta/${encodeURIComponent(slug)}`,
  }
}

/** An invitation to one evening around an event. Sent by email, kept out of search. */
export function rsvpMeta(invitation, eventSlug, occasion) {
  const eventName = invitation.event?.name || SITE_NAME
  return {
    title: `${invitation.name} | ${eventName}`,
    description: invitation.lede || `An invitation to the ${invitation.name} at ${eventName}.`,
    image: invitation.hero_path || eventImage(eventSlug),
    path: eventRsvp(eventSlug, occasion),
    noindex: true,
  }
}

/* ─── Rendering ────────────────────────────────────────────────────────── */

/**
 * The <title> text and the head tags for one page, as [tagName, attributes] pairs.
 * PageMeta turns them into React elements; the edge function into HTML.
 */
export function headTags(meta = {}) {
  const title = meta.title || DEFAULT_META.title
  const description = meta.description || DEFAULT_META.description
  const image = absoluteUrl(meta.image || DEFAULT_IMAGE)
  const url = `${SITE_URL}${meta.path ?? ''}`
  const sized = image.startsWith(`${SITE_URL}${OG_DIR}`) || image === absoluteUrl(DEFAULT_IMAGE)
    || image === absoluteUrl('/images/hersoccerex/og.jpg')

  const tags = [
    ['meta', { name: 'description', content: description }],
    ['link', { rel: 'canonical', href: url }],
  ]
  // A page held back before its announcement must not turn up in a search result,
  // which would defeat the point of holding it back.
  if (meta.noindex) tags.push(['meta', { name: 'robots', content: 'noindex, nofollow' }])
  tags.push(
    ['meta', { property: 'og:site_name', content: SITE_NAME }],
    ['meta', { property: 'og:type', content: meta.type || 'website' }],
    ['meta', { property: 'og:url', content: url }],
    ['meta', { property: 'og:title', content: title }],
    ['meta', { property: 'og:description', content: description }],
    ['meta', { property: 'og:image', content: image }],
  )
  if (sized) {
    tags.push(
      ['meta', { property: 'og:image:width', content: '1200' }],
      ['meta', { property: 'og:image:height', content: '630' }],
    )
  }
  tags.push(
    ['meta', { name: 'twitter:card', content: meta.card || 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: title }],
    ['meta', { name: 'twitter:description', content: description }],
    ['meta', { name: 'twitter:image', content: image }],
  )
  return { title, tags }
}

export function absoluteUrl(src) {
  if (/^https?:\/\//i.test(src)) return src
  return `${SITE_URL}${src.startsWith('/') ? '' : '/'}${src}`
}

/* ─── Helpers ──────────────────────────────────────────────────────────── */

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December']

/** "September 23 to 25, 2026 at Nu Stadium, Miami", or whatever part of it the event has. */
function eventWhen(event) {
  if (!event) return ''
  const dates = dateRange(event.starts_on, event.ends_on)
  const venue = [event.venue?.name, event.venue?.city].filter(Boolean).join(', ')
  if (dates && venue) return `${dates} at ${venue}`
  return dates || (venue ? `at ${venue}` : '')
}

function dateRange(start, end) {
  const a = parseDate(start)
  const b = parseDate(end) || a
  if (!a) return ''
  if (a.y !== b.y) return `${MONTHS[a.m]} ${a.d}, ${a.y} to ${MONTHS[b.m]} ${b.d}, ${b.y}`
  if (a.m !== b.m) return `${MONTHS[a.m]} ${a.d} to ${MONTHS[b.m]} ${b.d}, ${a.y}`
  if (a.d !== b.d) return `${MONTHS[a.m]} ${a.d} to ${b.d}, ${a.y}`
  return `${MONTHS[a.m]} ${a.d}, ${a.y}`
}

function parseDate(value) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value || '')
  return m ? { y: Number(m[1]), m: Number(m[2]) - 1, d: Number(m[3]) } : null
}

function isPastEvent(event) {
  const end = event?.ends_on || event?.starts_on
  return Boolean(end) && end.slice(0, 10) < new Date().toISOString().slice(0, 10)
}

function withSuffix(title, suffix) {
  return title.includes(`| ${suffix}`) ? title : `${title} | ${suffix}`
}

function stripFinalStop(text) {
  return text.replace(/[.\s]+$/, '')
}

function decodeSegment(segment) {
  try { return decodeURIComponent(segment) } catch { return segment }
}

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“' }

/** Markup-free text, cut at a word boundary to at most `max` characters. */
export function plainText(value, max = 200) {
  if (!value) return ''
  const text = String(value)
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, code) => {
      if (code[0] === '#') {
        const n = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10)
        return Number.isFinite(n) ? String.fromCodePoint(n) : m
      }
      return ENTITIES[code.toLowerCase()] ?? m
    })
    .replace(/\s+/g, ' ')
    .trim()
  if (text.length <= max) return text
  const cut = text.slice(0, max - 1)
  const space = cut.lastIndexOf(' ')
  return `${(space > max * 0.6 ? cut.slice(0, space) : cut).replace(/[\s,;:.]+$/, '')}…`
}
