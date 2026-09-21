import { useState } from 'react'
import { Download, Share2, Check } from 'lucide-react'
import { HERSOCCEREX_FOUNDING_PDF, HERSOCCEREX_FOUNDING_SHARE } from '../lib/routes'
import { HER, HER_SERIF, HER_ASSETS, herPill } from '../lib/hersoccerexTheme'

const FILE_NAME = 'HerSoccerex Founding Document.pdf'

/* Share the document's own link. Phones and most browsers open the system
   share sheet; where there is none, the link goes to the clipboard, and as a
   last resort it is shown so it can be copied by hand. */
async function shareDocument(onCopied) {
  const url = `${window.location.origin}${HERSOCCEREX_FOUNDING_SHARE}`
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'HerSoccerex Founding Document',
        text: 'Who HerSoccerex is, what we stand for and what we are building together.',
        url,
      })
      return
    } catch (err) {
      if (err?.name === 'AbortError') return
    }
  }
  try {
    await navigator.clipboard.writeText(url)
    onCopied()
  } catch {
    window.prompt('Copy this link to share the founding document', url)
  }
}

/* The founding document as a card: its cover, what is in it, and a download
   and share button. Used on the HerSoccerex page and the home page. */
export default function HerSoccerexDocument({ title = 'The founding document' }) {
  const [copied, setCopied] = useState(false)
  const onCopied = () => {
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6" style={{ background: HER.card, border: `1px solid ${HER.line}`, borderRadius: 12, padding: 'clamp(22px, 3vw, 32px)' }}>
      <a href={HERSOCCEREX_FOUNDING_PDF} target="_blank" rel="noopener" aria-label="Open the HerSoccerex founding document" style={{ flexShrink: 0 }}>
        <img
          src={`${HER_ASSETS}/founding-document-cover.webp`} alt=""
          width={600} height={776} loading="lazy"
          style={{ width: 150, height: 'auto', display: 'block', borderRadius: 4, border: `1px solid ${HER.line}`, boxShadow: '0 14px 34px rgba(32,53,106,0.16)' }}
        />
      </a>
      <div className="text-center sm:text-left" style={{ minWidth: 0 }}>
        <h3 style={{ fontFamily: HER_SERIF, fontWeight: 600, color: HER.ink, fontSize: 'clamp(1.5rem, 2.2vw, 1.75rem)', lineHeight: 1.15 }}>
          {title}
        </h3>
        <p style={{ fontSize: '0.98rem', lineHeight: 1.6, color: HER.body, marginTop: 8 }}>
          Who we are, what we stand for and what we are building together.
        </p>
        <p style={{ fontSize: '0.85rem', color: '#6B6F7B', marginTop: 6 }}>PDF, 4 pages, 1.6 MB</p>
        <div className="flex flex-wrap justify-center sm:justify-start gap-2" style={{ marginTop: 18 }}>
          <a href={HERSOCCEREX_FOUNDING_PDF} download={FILE_NAME} style={{ ...herPill(true), padding: '11px 20px', fontSize: '0.9rem' }}>
            <Download size={16} /> Download
          </a>
          <button type="button" onClick={() => shareDocument(onCopied)} style={{ ...herPill(false), padding: '11px 20px', fontSize: '0.9rem' }}>
            {copied ? <><Check size={16} /> Link copied</> : <><Share2 size={16} /> Share</>}
          </button>
        </div>
      </div>
    </div>
  )
}
