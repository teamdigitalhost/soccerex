import { Helmet } from 'react-helmet-async'

const SITE_NAME   = 'Soccerex'
const SITE_URL    = 'https://soccerex.com'
const DEFAULT_IMG = `${SITE_URL}/brand/soccerex-og-default.jpg`

/**
 * Per-route <head> metadata for social sharing and SEO.
 *
 * Usage:
 *   <PageMeta
 *     title="Sponsor | Soccerex Miami 2026"
 *     description="Partner with Soccerex and reach football's decision-makers."
 *     image="/events/miami/2026/sections/nu-stadium-miami-freedom-park.jpg"
 *     path="/sponsor"
 *   />
 *
 * All props are optional — sensible site defaults apply.
 */
export default function PageMeta({
  title       = 'Soccerex — 30 Years at the Center of the Business of Football',
  description = 'Soccerex connects the people who drive the global game forward — clubs, leagues, brands, investors, and innovators — across events in Miami, Europe, and the Middle East.',
  image       = DEFAULT_IMG,
  path        = '',
  type        = 'website',
}) {
  const canonical = `${SITE_URL}${path}`
  // Resolve relative image paths to absolute URLs for OG/Twitter cards
  const ogImage = image.startsWith('http') ? image : `${SITE_URL}${image}`

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:site_name"   content={SITE_NAME} />
      <meta property="og:type"        content={type} />
      <meta property="og:url"         content={canonical} />
      <meta property="og:title"       content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image"       content={ogImage} />

      {/* Twitter / X Card */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image"       content={ogImage} />
    </Helmet>
  )
}
