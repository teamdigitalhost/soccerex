import { Helmet } from 'react-helmet-async'
import { headTags } from '../lib/pageMeta'

/**
 * Per-route <head> metadata for social sharing and SEO.
 *
 * Usage, for a route with fixed meta (see PAGES in src/lib/pageMeta.js):
 *   <PageMeta {...pageMeta(SPONSOR)} />
 *
 * Pages built from API data pass the result of the matching builder in pageMeta.js
 * (articleMeta, speakerMeta, eventPageMeta...). The social-meta edge function renders
 * the same tags into the HTML for link unfurlers, so both always agree.
 *
 * Props: title, description, image, path, type, noindex, card. All optional; the site
 * defaults fill anything left out.
 */
export default function PageMeta(props) {
  const { title, tags } = headTags(props)
  return (
    <Helmet>
      <title>{title}</title>
      {tags.map(([tag, attrs]) => {
        const key = attrs.name || attrs.property || attrs.rel
        return tag === 'link' ? <link key={key} {...attrs} /> : <meta key={key} {...attrs} />
      })}
    </Helmet>
  )
}
