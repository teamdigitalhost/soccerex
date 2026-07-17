import { useState } from 'react'
import Lightbox from './Lightbox'

// Masonry image grid. Images render directly with native loading="lazy" so the
// browser handles deferring off-screen downloads — simpler and more robust than
// a hand-rolled IntersectionObserver (the previous version observed items with
// an observer it then disconnected, so nothing ever loaded).
export default function ImageGrid({ images, columns = 3, showCaptions = true, maxItems = null }) {
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const displayImages = maxItems ? images.slice(0, maxItems) : images
  // Small, capped grids (e.g. an event recap's 12 photos) load eagerly so they
  // always appear; the big gallery stays lazy for performance.
  const eager = maxItems != null && maxItems <= 20

  // Distribute images across columns for the masonry layout.
  const columnArrays = Array.from({ length: columns }, () => [])
  displayImages.forEach((img, i) => {
    columnArrays[i % columns].push({ ...img, globalIndex: i })
  })

  return (
    <>
      <div className={`gallery-grid gallery-grid-${columns}`}>
        {columnArrays.map((col, colIdx) => (
          <div key={colIdx} className="gallery-column">
            {col.map((img) => (
              <div
                key={img.src}
                className="gallery-item"
                onClick={() => setLightboxIndex(img.globalIndex)}
              >
                <div className="gallery-item-inner">
                  <img
                    src={img.src}
                    alt={img.caption}
                    className="gallery-image"
                    loading={eager ? 'eager' : 'lazy'}
                  />
                  {showCaptions && (
                    <div className="gallery-caption-overlay">
                      <p className="gallery-caption-title">{img.caption}</p>
                      <p className="gallery-caption-event">{img.event}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          image={displayImages[lightboxIndex]}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((lightboxIndex - 1 + displayImages.length) % displayImages.length)}
          onNext={() => setLightboxIndex((lightboxIndex + 1) % displayImages.length)}
        />
      )}
    </>
  )
}
