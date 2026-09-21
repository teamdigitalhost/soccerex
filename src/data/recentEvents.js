/**
 * Past Soccerex events. The events page lists them, and each one with a `slug` has
 * its own recap page at /{slug} (see EventRecap). Plain data, no JSX: the social-meta
 * edge function reads it too, to title a shared recap link.
 */
export const RECENT = [
  {
    logo: '/images/events/logos/europe.webp',
    label: 'SOCCEREX EUROPE 2026',
    dates: 'May 12-13, 2026',
    city: 'Johan Cruijff ArenA, Amsterdam',
    image: '/images/events/events/europe-ajax-arena.webp',
    copy: 'The 30th anniversary edition of Soccerex Europe wrapped a record-breaking gathering at the Johan Cruijff ArenA, bringing federations, leagues, clubs, brands, media, governing bodies, and football legends together to mark three decades of the platform.',
    link: '/europe-2026',
    internal: true,
  },
  {
    logo: '/images/events/logos/miami.webp',
    label: 'SOCCEREX MIAMI 2025',
    dates: 'November 11th - 13th, 2025',
    city: 'Miami Beach Convention Center',
    image: '/images/events/events/miami-2025-stage.jpg', // verified: shows "SOCCEREX MIAMI" on screen
    copy: 'In 2025, we hosted three large-scale events for the first time since 2019, marking a major milestone for the global football business industry. The trifecta of major gatherings continued with Soccerex Miami, which took place from 11th to 13th November at the Miami Beach Convention Center. Bringing together key stakeholders from across the football ecosystem, the event served as a global platform for innovation, collaboration, and shaping the future of the game.',
    slug: 'miami-2025',
    // What a shared link to the recap page shows (see src/lib/pageMeta.js).
    name: 'Soccerex Miami 2025',
    summary: 'Soccerex Miami 2025 brought the football business community to the Miami Beach Convention Center, November 11 to 13, 2025.',
    region: 'miami',
    link: '/miami-2025',
    internal: true,
  },
  {
    logo: '/images/events/logos/europe.webp',
    label: 'SOCCEREX EUROPE 2025',
    dates: 'May 19th - 21st, 2025',
    city: 'Johan Cruijff ArenA, Amsterdam',
    image: '/images/events/events/europe-2025-knvb-stage.jpg', // VERIFIED: KNVB-branded Soccerex Europe 2025 stage, Amsterdam
    copy: 'Building on the success of Soccerex Europe 2024, which featured an insightful session on how AI was transforming football and standout discussions with speakers from TikTok, Ajax, and LALIGA, the football industry\'s premier European event returned to Amsterdam in 2025. Amsterdam, full of football innovation and rich history, provided the perfect backdrop for Soccerex Europe 2025. The renowned Johan Cruijff ArenA, an international leader in sustainability and fan experience, was the ideal venue for an event that celebrated and shaped the future of the beautiful game. Having previously staged Champions League finals and UEFA Euro 2000, this year\'s event proved to be a landmark gathering for federations, leagues, clubs, brands, media, governing bodies, and legends from across the globe.',
    slug: 'europe-2025',
    // What a shared link to the recap page shows (see src/lib/pageMeta.js).
    name: 'Soccerex Europe 2025',
    summary: 'Soccerex Europe 2025 returned to Amsterdam and the Johan Cruijff ArenA, May 19 to 21, 2025.',
    region: 'europe',
    link: '/europe-2025',
    internal: true,
  },
  {
    logo: '/images/events/logos/mena.webp',
    label: 'SOCCEREX MENA 2025',
    dates: 'February 23rd - 26th, 2025',
    city: 'Cairo, Egypt',
    image: '/images/events/events/mena-2025-cairo-signing.jpg', // VERIFIED: MENA Cairo 2025 signing ceremony
    copy: 'Following the success of Soccerex Europe and Miami in 2024, 2025 saw us host three large-scale events for the first time since 2019. The football business industry\'s trifecta of major gatherings began with Soccerex MENA, in partnership with Sports Expo, held from February 23-26. This event was hosted in Cairo, Egypt, home of "The Pharaohs," the most successful national team in Africa Cup of Nations history.',
    slug: 'mena-2025',
    // What a shared link to the recap page shows (see src/lib/pageMeta.js).
    name: 'Soccerex MENA 2025',
    summary: 'Soccerex MENA 2025 took place in Cairo, Egypt, with Sports Expo, February 23 to 26, 2025.',
    region: 'all',
    link: '/mena-2025',
    internal: true,
  },
  {
    logo: '/images/events/logos/miami.webp',
    label: 'SOCCEREX MIAMI 2024',
    dates: 'November 13th - 14th, 2024',
    city: 'Miami, USA',
    image: '/images/events/events/miami-2024-verified.jpg', // VERIFIED: packed keynote in hotel ballroom, Miami
    copy: 'After our fourth and most recent installment in the magic city in November 2023 which saw 29-year-old Soccerex records shattered, it was confirmed that the USA is truly the beautiful games\' adopted home. With a World Cup to look forward to in under two years (by the time of the event), broadcasting figures at an all-time high and the MLS becoming a truly global product (even being home to arguably the greatest player in history), it is a remarkably exciting time for Soccer in the Americas.',
    slug: 'miami-2024',
    // What a shared link to the recap page shows (see src/lib/pageMeta.js).
    name: 'Soccerex Miami 2024',
    summary: 'Soccerex Miami 2024 brought the football business community to Miami, November 13 and 14, 2024.',
    region: 'miami',
    link: '/miami-2024',
    internal: true,
  },
  {
    logo: '/images/events/logos/europe.webp',
    label: 'SOCCEREX EUROPE 2024',
    dates: 'May 30th - 31st, 2024',
    city: 'Johan Cruijff ArenA, Amsterdam',
    image: '/images/events/events/europe-2025-verified.jpg', // VERIFIED: packed keynote, blue lit venue, Europe
    copy: 'It was a memorable occasion as football returned to European soil for the first time since 2019, hosted at the iconic home of AFC Ajax. After nearly 5 years, Soccerex brought the football business community together again in Amsterdam, just before the start of the European Championships in Germany.',
    slug: 'europe-2024',
    // What a shared link to the recap page shows (see src/lib/pageMeta.js).
    name: 'Soccerex Europe 2024',
    summary: 'Soccerex Europe 2024 brought the football business community back to the Johan Cruijff ArenA in Amsterdam, May 30 and 31, 2024.',
    region: 'europe',
    link: '/europe-2024',
    internal: true,
  },
  {
    logo: '/images/events/logos/miami.webp',
    label: 'SOCCEREX MIAMI 2023',
    dates: 'November 14th - 15th, 2023',
    city: 'Mana Wynwood Convention Center, Miami',
    image: '/images/events/events/miami-2023-verified.jpg', // VERIFIED: outdoor "SOCCEREX MIAMI" banner with crowd
    copy: 'Soccerex Miami will be held at the wonderful Mana Wynwood Convention Center, a venue that has been leading the way in the entertainment and arts industries since 2010. 70+ speakers will take the main stage, providing insight on a myriad of topics including but not limited to, performance, broadcasting, good governance, fan engagement, athlete development, technology, analytics, and major tournaments.',
    slug: 'miami-2023',
    // What a shared link to the recap page shows (see src/lib/pageMeta.js).
    name: 'Soccerex Miami 2023',
    summary: 'Soccerex Miami 2023 brought the football business community to the Mana Wynwood Convention Center, November 14 and 15, 2023.',
    region: 'miami',
    link: '/miami-2023',
    internal: true,
  },
]
