/* HerSoccerex takes its look from its founding document: warm cream paper, the
   navy and pink of the wordmark, gold rules and a serif display face. The cream
   matches the florals' own background exactly, so the corner artwork sits on
   the page with no visible edge. Shared by the HerSoccerex page and the home
   page section. */
export const HER = {
  paper: '#F9F6EF',
  card: '#FDFBF6',
  line: '#E7DECB',
  navy: '#20356A',
  ink: '#1B2340',
  body: '#4A4F5E',
  pink: '#E72F87',
  gold: '#A67C3B',
}

export const HER_SERIF = "'Cormorant Garamond', Georgia, 'Times New Roman', serif"
export const HER_ASSETS = '/images/hersoccerex'

export function herPill(primary) {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '14px 26px', borderRadius: 999,
    fontSize: '0.95rem', fontWeight: 600, textDecoration: 'none', cursor: 'pointer',
    background: primary ? HER.pink : 'transparent',
    color: primary ? '#fff' : HER.navy,
    border: primary ? `1px solid ${HER.pink}` : `1px solid ${HER.navy}`,
  }
}
