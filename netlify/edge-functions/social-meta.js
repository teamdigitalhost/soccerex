/**
 * Gives every shared soccerex.com link its own title, description and preview image.
 *
 * The site is a single-page app, so every route is served the same index.html, and the
 * per-page tags only appear once React runs. Link unfurlers (Facebook, LinkedIn,
 * iMessage, Slack, WhatsApp, X) never run it, so this function writes the route's tags
 * into the HTML on its way out. The values come from src/lib/pageMeta.js, the same
 * module the pages render from, so the card and the page always agree.
 *
 * - Fixed pages, redirects, recaps and press releases resolve from that module alone.
 * - Articles, speaker profiles, event agenda and speaker pages, partner pages, CTA pages
 *   and invitations need the API. That lookup runs for unfurlers and crawlers only: a
 *   person's browser gets the same tags from React a moment later, so it is not made to
 *   wait on the API first.
 * - Anything unresolved, or any failure, leaves index.html's defaults in place.
 *
 * Deployed with the site by `netlify deploy` (see netlify.toml); there is no build step.
 */
import {
  staticMetaFor, headTags, articleMeta, lockedArticleMeta, eventPageMeta, speakerMeta,
  partnerMeta, ctaMeta, rsvpMeta,
} from '../../src/lib/pageMeta.js'

const DEFAULT_API = 'https://soccerex.digitalhost.co/api/v1'
const MIAMI_EVENT_SLUG = 'soccerex-miami-2026'
/* Unfurlers wait several seconds for a page; a cold API call can take two or three. */
const API_TIMEOUT_MS = 4000
const CACHE_TTL_MS = 5 * 60 * 1000

/* User agents that fetch a page to describe it rather than to show it to a person. */
const UNFURLER = /bot\b|bot\/|crawl|spider|slurp|facebookexternalhit|facebot|whatsapp|telegram|slack|discord|linkedin|skype|pinterest|vkshare|embedly|iframely|mastodon|cardyb|preview|quora|outbrain|google-|headless/i

export default async function socialMeta(request, context) {
  const url = new URL(request.url)
  const [response, meta] = await Promise.all([
    context.next(),
    metaFor(url, request).catch((err) => {
      console.error(`social-meta: ${url.pathname}: ${err?.message || err}`)
      return null
    }),
  ])
  if (!meta || response.status !== 200) return response
  if (!(response.headers.get('content-type') || '').includes('text/html')) return response

  const html = await response.text()
  const headers = new Headers(response.headers)
  headers.delete('content-length')
  headers.delete('etag')
  return new Response(rewriteHead(html, meta), { status: response.status, headers })
}

export const config = {
  pattern: '^/.*$',
  // Files (scripts, images, the sitemap) never need tags, so they never invoke this.
  excludedPattern: '^/.*\\.[A-Za-z0-9]+$',
  method: 'GET',
  // If this function ever throws, Netlify serves the page untouched, with index.html's defaults.
  onError: 'bypass',
}

async function metaFor(url, request) {
  const fixed = staticMetaFor(url.pathname)
  if (fixed) return fixed
  const lookup = apiLookup(url.pathname)
  if (!lookup || !isUnfurler(request)) return null
  return lookup(url)
}

function isUnfurler(request) {
  if (UNFURLER.test(request.headers.get('user-agent') || '')) return true
  // Browsers mark a page load with Sec-Fetch-Mode: navigate. Unfurlers and plain HTTP
  // clients do not send it, so they get the full lookup too.
  return request.headers.get('sec-fetch-mode') !== 'navigate'
}

/* The routes whose tags come from the API, mirroring App.jsx. Returns a function that
   resolves the meta, or null for any other path. */
function apiLookup(pathname) {
  const parts = pathname.replace(/\/+$/, '').split('/').slice(1).map(decode)
  const [a, b, c, d, e] = parts
  const n = parts.length

  if (a === 'insights' && n === 2) return (url) => articleLookup(url, b)

  if (a === 'events' && n === 3 && EVENT_PAGES[c]) {
    return async () => {
      const event = await api(`/events/${enc(b)}`)
      return event && eventPageMeta(EVENT_PAGES[c], event, b)
    }
  }
  if (a === 'events' && n === 4 && c === 'speakers') {
    return async () => {
      const speaker = await api(`/events/${enc(b)}/speakers/${enc(d)}`)
      return speaker && speakerMeta(speaker, b)
    }
  }

  // Invitations: /events/{event}/rsvp/{occasion}, the Miami alias, and the bare
  // paths that forward to the Miami VIP night.
  if (a === 'events' && n === 5 && d === 'rsvp') return () => rsvpLookup(b, e)
  if (a === 'miami-2026' && n === 3 && b === 'rsvp') return () => rsvpLookup(MIAMI_EVENT_SLUG, c)
  if ((a === 'rsvp' && n === 1) || (a === 'miami-2026' && b === 'rsvp' && n === 2)) {
    return () => rsvpLookup(MIAMI_EVENT_SLUG, 'vip-night')
  }

  if (a === 'partners' && n === 2) {
    return async () => {
      const partner = await api(`/referral-partners/${enc(b)}`)
      return partner && partnerMeta(partner, b)
    }
  }
  if (a === 'cta' && n === 2) {
    return async () => {
      const cta = await api(`/ctas/${enc(b)}`)
      return cta && ctaMeta(cta, b)
    }
  }
  return null
}

const EVENT_PAGES = {
  agenda: 'agenda',
  schedule: 'agenda',
  speakers: 'speakers',
  'agenda-concept': 'themes',
  topics: 'themes',
}

/* The CMS first, then the legacy static manifest, the same order InsightArticle uses. */
async function articleLookup(url, slug) {
  const article = await api(`/articles/${enc(slug)}`)
  if (article?.locked) return lockedArticleMeta(slug)
  if (article) {
    return articleMeta({
      slug: article.slug || slug,
      title: article.meta_title || article.title,
      description: article.meta_description || article.excerpt,
      image: article.og_image_url || article.hero_image_url,
    })
  }
  const manifest = await cached(`manifest`, () => fetchJson(new URL('/insights-manifest.json', url)))
  const legacy = Array.isArray(manifest) && manifest.find((x) => x.slug === slug)
  return legacy
    ? articleMeta({ slug, title: legacy.title, description: legacy.excerpt, image: legacy.featuredImage })
    : null
}

async function rsvpLookup(eventSlug, occasion) {
  const invitation = await api(`/events/${enc(eventSlug)}/rsvps/${enc(occasion)}`)
  return invitation && rsvpMeta(invitation, eventSlug, occasion)
}

/* ─── API access ───────────────────────────────────────────────────────── */

function apiBase() {
  const configured = globalThis.Netlify?.env?.get('SOCCEREX_API_BASE_URL')
    || globalThis.Netlify?.env?.get('VITE_SOCCEREX_API_BASE_URL')
  // A relative base only works inside the browser (the dev proxy), never here.
  return (configured && /^https?:\/\//.test(configured) ? configured : DEFAULT_API).replace(/\/+$/, '')
}

/** GET an API path; the payload's `data`, or null for a 404, an error or a timeout. */
function api(path) {
  return cached(path, async () => {
    const payload = await fetchJson(`${apiBase()}${path}`)
    return payload && typeof payload === 'object' && 'data' in payload ? payload.data : payload
  })
}

async function fetchJson(href) {
  const res = await fetch(href, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
  }).catch(() => null)
  if (!res || !res.ok) return null
  return res.json().catch(() => null)
}

/* Per-isolate memo, so a burst of unfurls for one link costs one API call. */
const memo = new Map()
async function cached(key, load) {
  const hit = memo.get(key)
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.value
  const value = await load()
  if (value !== null) {
    if (memo.size > 200) memo.delete(memo.keys().next().value)
    memo.set(key, { at: Date.now(), value })
  }
  return value
}

/* ─── HTML ─────────────────────────────────────────────────────────────── */

/* The tags index.html carries as defaults, and anything else this function writes. */
const MANAGED = /[ \t]*(?:<title>[\s\S]*?<\/title>|<meta\s+(?:name|property)="(?:description|robots|og:[^"]*|twitter:[^"]*)"[^>]*>|<link\s+rel="canonical"[^>]*>)[ \t]*\r?\n?/gi

/** Swaps the default tags for this route's, placing them where the <title> was. */
export function rewriteHead(html, meta) {
  const { title, tags } = headTags(meta)
  const lines = [
    `<title>${escapeHtml(title)}</title>`,
    ...tags.map(([tag, attrs]) => `<${tag} ${Object.entries(attrs).map(([k, v]) => `${k}="${escapeHtml(v)}"`).join(' ')}>`),
  ]
  const block = lines.map((l) => `    ${l}\n`).join('')
  let placed = false
  const out = html.replace(MANAGED, () => {
    if (placed) return ''
    placed = true
    return block
  })
  return placed ? out : out.replace('</head>', `${block}  </head>`)
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function decode(segment) {
  try { return decodeURIComponent(segment) } catch { return segment }
}

const enc = encodeURIComponent
