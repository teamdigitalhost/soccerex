/**
 * Press releases at /press/{slug}, keyed by slug. Add new ones here. Plain data, no JSX:
 * the social-meta edge function reads it too, so a shared release link carries its own
 * headline. `image` is the preview image for that link.
 */
export const PRESS_RELEASES = {
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
