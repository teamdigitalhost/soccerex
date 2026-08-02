/**
 * Prebuild sitemap generator.
 * Reads public/insights-manifest.json and emits public/sitemap.xml with all
 * static routes + one entry per insight article.
 *
 * Run via:  node scripts/generate-sitemap.mjs
 * Wired as: "prebuild" in package.json so it runs before every `vite build`.
 */

import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dir = dirname(fileURLToPath(import.meta.url))
const root  = join(__dir, '..')

const SITE = 'https://soccerex.com'

// Static public routes (excludes redirects, auth routes, and private portals)
const STATIC_ROUTES = [
  { path: '/',                           priority: '1.0', changefreq: 'weekly'  },
  { path: '/about',                      priority: '0.7', changefreq: 'monthly' },
  { path: '/events',                     priority: '0.9', changefreq: 'weekly'  },
  { path: '/contact',                    priority: '0.6', changefreq: 'monthly' },
  { path: '/global-network',             priority: '0.7', changefreq: 'monthly' },
  { path: '/gallery',                    priority: '0.6', changefreq: 'monthly' },
  { path: '/past-speakers',             priority: '0.6', changefreq: 'monthly' },
  { path: '/miami-2026',                 priority: '0.9', changefreq: 'weekly'  },
  { path: '/miami-2026/press-release',   priority: '0.7', changefreq: 'monthly' },
  { path: '/miami-2026/pricing',         priority: '0.8', changefreq: 'weekly'  },
  { path: '/accommodations',             priority: '0.7', changefreq: 'monthly' },
  { path: '/sponsor',                    priority: '0.9', changefreq: 'weekly'  },
  { path: '/exhibit',                    priority: '0.9', changefreq: 'weekly'  },
  { path: '/insights',                   priority: '0.8', changefreq: 'weekly'  },
  { path: '/privacy-policy',             priority: '0.3', changefreq: 'yearly'  },
  { path: '/terms',                      priority: '0.3', changefreq: 'yearly'  },
  { path: '/cookie-policy',             priority: '0.3', changefreq: 'yearly'  },
  { path: '/refund-policy',             priority: '0.3', changefreq: 'yearly'  },
]

function escape(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function urlEntry({ loc, lastmod, changefreq, priority }) {
  return [
    '  <url>',
    `    <loc>${escape(loc)}</loc>`,
    lastmod  ? `    <lastmod>${escape(lastmod)}</lastmod>` : '',
    changefreq ? `    <changefreq>${escape(changefreq)}</changefreq>` : '',
    priority ? `    <priority>${escape(priority)}</priority>` : '',
    '  </url>',
  ].filter(Boolean).join('\n')
}

// Load insight articles
const insightsRaw = readFileSync(join(root, 'public', 'insights-manifest.json'), 'utf8')
const articles = JSON.parse(insightsRaw)

const today = new Date().toISOString().slice(0, 10)

const entries = [
  // Static routes
  ...STATIC_ROUTES.map(r => urlEntry({
    loc: `${SITE}${r.path}`,
    lastmod: today,
    changefreq: r.changefreq,
    priority: r.priority,
  })),
  // Insight articles
  ...articles.map(a => urlEntry({
    loc: `${SITE}/insights/${encodeURIComponent(a.slug)}`,
    lastmod: a.date || today,
    changefreq: 'monthly',
    priority: '0.7',
  })),
]

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...entries,
  '</urlset>',
  '',
].join('\n')

const dest = join(root, 'public', 'sitemap.xml')
writeFileSync(dest, xml, 'utf8')
console.log(`[sitemap] wrote ${entries.length} URLs → public/sitemap.xml`)
