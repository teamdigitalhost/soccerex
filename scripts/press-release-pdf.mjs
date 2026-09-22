/**
 * Builds the downloadable PDF of a press release from the same data the page uses, so the file a
 * journalist saves and the page they read never drift apart.
 *
 *   node scripts/press-release-pdf.mjs neau-water-soccerex-miami-2026
 *
 * Writes public/downloads/press-<slug>.pdf. Needs Chrome on the machine: set CHROME, or it looks in
 * the usual places (a Playwright headless shell, then Google Chrome).
 */
import { execFileSync } from 'child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'fs'
import { homedir, tmpdir } from 'os'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { globSync } from 'fs'

import { PRESS_RELEASES } from '../src/data/pressReleases.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const slug = process.argv[2]
const release = PRESS_RELEASES[slug]
if (!release) {
  console.error(`Unknown release "${slug}". Known: ${Object.keys(PRESS_RELEASES).join(', ')}`)
  process.exit(1)
}

function chrome() {
  // The headless shell first: full Chrome can sit forever on a headless print on this machine.
  const candidates = [
    process.env.CHROME,
    ...globSync(join(homedir(), 'Library/Caches/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-*/chrome-headless-shell')),
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ].filter(Boolean)
  const found = candidates.find((c) => existsSync(c))
  if (!found) throw new Error('No Chrome found. Set CHROME to a Chrome or chrome-headless-shell binary.')
  return found
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const asset = (p) => `file://${join(root, 'public', p.replace(/^\//, ''))}`

const body = release.content.map((block) => {
  if (block.type === 'quote') {
    return `<blockquote>${esc(block.text)}${block.author ? `<cite>${esc(block.author)}${block.role ? `, ${esc(block.role)}` : ''}</cite>` : ''}</blockquote>`
  }
  if (block.type !== 'p') return ''
  if (block.bold) {
    const [lead, ...rest] = block.text.split('.')
    return `<p><strong>${esc(lead)}.</strong>${esc(rest.join('.'))}</p>`
  }
  return `<p>${esc(block.text)}</p>`
}).join('\n')

const contacts = (release.contacts || [{ org: 'Soccerex', email: 'press@soccerex.com' }])
  .map((c) => `<p class="contact"><span>${esc(c.org)}</span> <a href="mailto:${esc(c.email)}">${esc(c.email)}</a></p>`)
  .join('\n')

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>${esc(release.title)}</title>
<style>
  @page { size: letter; margin: 18mm 16mm 16mm; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: Helvetica, Arial, sans-serif; color: #2b2b2b; font-size: 10.5pt; line-height: 1.55; }
  header { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #09203e; padding-bottom: 10px; margin-bottom: 22px; }
  header img { height: 26px; }
  header span { font-size: 8pt; letter-spacing: 0.14em; text-transform: uppercase; color: #8a8a8a; }
  .visual { width: 100%; border-radius: 8px; margin-bottom: 22px; }
  h1 { font-size: 20pt; line-height: 1.2; color: #09203e; margin: 0 0 10px; }
  .standfirst { font-size: 11.5pt; color: #4a4a4a; margin: 0 0 8px; }
  .date { font-size: 9pt; color: #8a8a8a; margin: 0 0 22px; }
  p { margin: 0 0 12px; }
  blockquote { margin: 18px 0; padding-left: 16px; border-left: 3px solid #E91E63; font-style: italic; color: #1a1a1a; page-break-inside: avoid; }
  blockquote cite { display: block; margin-top: 6px; font-style: normal; font-size: 9pt; color: #777; }
  h2 { font-size: 11pt; text-transform: uppercase; letter-spacing: 0.08em; color: #09203e; margin: 26px 0 8px; }
  footer { margin-top: 26px; border-top: 1px solid #e2e2e2; padding-top: 14px; font-size: 9pt; color: #777; page-break-inside: avoid; }
  .contact span { color: #2b2b2b; font-weight: 600; }
  a { color: #09203e; }
</style></head>
<body>
  <header><img src="${asset('/logos/soccerex---logo-landscape-blue.png')}" alt="Soccerex"><span>For immediate release</span></header>
  ${release.visual ? `<img class="visual" src="${asset(release.visual.src)}" alt="">` : ''}
  <h1>${esc(release.title)}</h1>
  ${release.subtitle ? `<p class="standfirst">${esc(release.subtitle)}</p>` : ''}
  <p class="date">${esc(release.date)}</p>
  ${body}
  <h2>About Soccerex</h2>
  <p>Soccerex is a global football business platform connecting clubs, leagues, federations, confederations, brands, investors, technology companies, media organizations and executives from across the international game. For nearly 30 years, Soccerex has created opportunities for connection, collaboration, innovation and commercial growth across the global football industry.</p>
  <footer>
    <p style="color:#2b2b2b;font-weight:600;margin-bottom:6px">Media contacts</p>
    ${contacts}
    <p style="margin-top:10px">soccerex.com</p>
  </footer>
</body></html>
`

const work = join(tmpdir(), `press-${slug}`)
mkdirSync(work, { recursive: true })
const page = join(work, 'release.html')
writeFileSync(page, html, 'utf8')
mkdirSync(join(root, 'public', 'downloads'), { recursive: true })
const dest = join(root, 'public', 'downloads', `press-${slug}.pdf`)
execFileSync(chrome(), [
  '--headless', '--disable-gpu', '--no-pdf-header-footer',
  `--user-data-dir=${join(work, 'profile')}`,
  `--print-to-pdf=${dest}`, '--virtual-time-budget=8000', `file://${page}`,
], { stdio: 'ignore' })
rmSync(work, { recursive: true, force: true })
console.log(`${dest} (${(readFileSync(dest).length / 1024).toFixed(0)} KB)`)
