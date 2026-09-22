/**
 * Press releases at /press/{slug}, keyed by slug. Add new ones here. Plain data, no JSX:
 * the social-meta edge function reads it too, so a shared release link carries its own
 * headline. `image` is the preview image for that link.
 */
export const PRESS_RELEASES = {
  'neau-water-soccerex-miami-2026': {
    title: 'Soccerex and neaū Water Renew Hydration Partnership for Soccerex Miami 2026',
    subtitle: 'A second consecutive year of partnership brings neaū\u2019s premium, PFAS-free water and H.A.R.T.® Technology to Soccerex guests and VIPs in Miami.',
    date: 'September 22, 2026',
    category: 'Partnership',
    image: '/images/press/neau-water-soccerex.jpg',
    visual: { src: '/images/press/neau-water-soccerex.jpg', alt: 'neaū water and Soccerex' },
    backLink: '/miami-2026',
    backLabel: 'Back to Miami 2026',
    contacts: [
      { org: 'neaū water, Press & Media', email: 'media@neauwater.com' },
      { org: 'Soccerex, Media & Communications', email: 'ivan@soccerex.com' },
    ],
    content: [
      { type: 'p', bold: true, text: 'Miami, FL.' },
      { type: 'p', text: 'Soccerex and neaū water today announced the renewal of their partnership for Soccerex Miami 2026, marking the second consecutive year the global football business platform and premium hydration technology company will work together to provide Soccerex guests, executives and VIPs with PFAS-free premium water.' },
      { type: 'p', text: 'The renewed partnership reflects neaū\'s growing presence within global soccer and its commitment to advancing the conversation around water quality, hydration and performance.' },
      { type: 'p', text: 'At the heart of neaū water is its proprietary H.A.R.T.® (Hydration by Advanced Restorative Technology®), a physical water-refinement process designed to improve filtration efficiency and deliver exceptionally clean, smooth-tasting water without chemical additives.' },
      { type: 'p', text: 'The company\'s approach is centered on the belief that water should be treated as a critical part of health, performance, longevity and wellbeing, particularly in elite sport where hydration plays an essential role in preparation, competition and recovery.' },
      { type: 'quote', text: '\u201cSoccerex brings together many of the most influential people and organizations shaping the future of the game, which makes this partnership especially meaningful for neaū. Hydration is fundamental to performance, focus and recovery, and we believe athletes and consumers should expect more from the water they drink. Returning to Soccerex for a second year allows us to continue introducing the global soccer community to a cleaner and more advanced approach to hydration.\u201d', author: 'Hani Beshara', role: 'CEO, neaū water' },
      { type: 'p', text: 'neaū has continued to expand its footprint within professional soccer through its official partnership with Concacaf, supporting player hydration across major Concacaf competitions. The relationship places neaū alongside elite athletes competing at the highest levels of the sport and reinforces the company\'s broader strategy of partnering with organizations that value performance, innovation and player wellbeing.' },
      { type: 'quote', text: '\u201cSoccerex is focused on creating an environment that reflects the innovation and standards of the modern game. We are pleased to welcome neaū water back for a second consecutive year. Their commitment to hydration innovation, their growing presence in soccer and their partnership with organizations such as Concacaf make them a strong fit for the Soccerex community.\u201d', author: 'Garrett Navia', role: 'CEO, Soccerex' },
      { type: 'p', text: 'At Soccerex Miami 2026, neaū water will be available to guests and VIPs throughout the event, bringing the company\'s clean hydration platform directly to executives, clubs, federations, brands, investors, media and other leaders from across the international football industry.' },
      { type: 'p', text: 'The renewed collaboration comes at an important time for soccer in the United States and the Americas, as Miami continues to strengthen its position as a major center for the sport, its business and its culture.' },
      { type: 'p', bold: true, text: 'About neaū Water.' },
      { type: 'p', text: 'neaū water is a premium clean-hydration company focused on water science, purity and innovation. Its proprietary H.A.R.T.® (Hydration by Advanced Restorative Technology®) is designed to enhance water refinement and filtration while delivering a clean, smooth hydration experience. neaū water is PFAS-free and has established partnerships across professional sports, including an official partnership with Concacaf supporting player hydration across major competitions. neauwater.com' },
    ],
  },

  'soccerex-europe-amsterdam-may-2026': {
    title: 'Soccerex Europe Returns to Amsterdam in May 2026 at the Johan Cruijff ArenA',
    date: 'January 14, 2026',
    category: 'Events',
    image: '/images/og/europe-2026.jpg',
    backLink: '/europe-2026',
    backLabel: 'Back to Event',
    content: [
      { type: 'p', bold: true, text: 'Amsterdam, Netherlands.' },
      { type: 'p', text: 'Soccerex, the world\'s leading football business platform, has today confirmed that Soccerex Europe will return to Amsterdam in May 2026, hosted once again at the iconic Johan Cruijff ArenA.' },
      { type: 'p', text: 'The 2026 edition marks the third consecutive Soccerex Europe event in Amsterdam, reinforcing the city\'s status as one of global football\'s most influential hubs for innovation, governance, and commercial leadership.' },
      { type: 'p', text: 'Following the success of previous editions, Soccerex Europe 2026 will bring together senior decision-makers from across the football ecosystem, including clubs, leagues, federations, investors, brands, and technology leaders.' },
      { type: 'p', text: 'Amsterdam\'s rich football heritage and progressive outlook continue to make it the ideal home for Soccerex Europe. The event builds on the spirit of the previous editions, which proudly carried the tagline "Total Football\'s Coming Home", celebrating the city\'s enduring influence on how the game is played, managed, and commercialised around the world.' },
      { type: 'p', text: 'Across two days, Soccerex Europe 2026 will feature a high-level conference program, curated networking experiences, an international exhibitor showcase, and exclusive content produced for Soccerex TV. Key themes will include football governance, investment and ownership, commercial growth, infrastructure and stadia development, fan engagement, performance innovation, and the future of the global game.' },
      { type: 'p', text: 'The Johan Cruijff ArenA once again provides a fitting stage for the event, offering a world-class venue at the intersection of elite sport, technology, and business. Attendees can expect an immersive experience designed to foster meaningful connections, strategic partnerships, and informed debate around the issues shaping football\'s future.' },
      { type: 'quote', text: '"We\'re incredibly excited to be bringing Soccerex Europe back to Amsterdam for a third time. The Johan Cruijff ArenA provides an unrivalled setting to host two days of world-class content, high-level networking, and a truly international exhibition."', author: 'Garrett Navia', role: 'Managing Director of Soccerex' },
      { type: 'quote', text: '"Attendees can expect engaging discussions on the issues shaping football\'s future, innovative activations across the venue, and curated social evenings that create the environment for meaningful relationships to form. Soccerex Europe 2026 will be our most dynamic and connected Amsterdam edition yet."' },
      { type: 'p', text: 'Further announcements regarding speakers, partners, exhibitors, and ticketing will be made in the coming months. For more information and to register interest, please visit www.soccerex.com.' },
    ],
  },
}
