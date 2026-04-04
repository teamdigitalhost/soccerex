import { useState, useEffect, useRef } from 'react'
import Lightbox from './Lightbox'

export default function ImageGrid({ images, columns = 3, showCaptions = true, maxItems = null }) {
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [loadedImages, setLoadedImages] = useState(new Set())
  const observerRef = useRef(null)

  const displayImages = maxItems ? images.slice(0, maxItems) : images
  const eagerLoad = maxItems && maxItems <= 20 // small grids load eagerly

  // Lazy loading with IntersectionObserver (only for large grids)
  useEffect(() => {
    if (eagerLoad) {
      // Load all immediately for small grids
      setLoadedImages(new Set(displayImages.map((img) => img.src)))
      return
    }
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const src = entry.target.dataset.src
            if (src) {
              setLoadedImages((prev) => new Set([...prev, src]))
              observerRef.current?.unobserve(entry.target)
            }
          }
        })
      },
      { rootMargin: '300px' }
    )

    return () => observerRef.current?.disconnect()
  }, [eagerLoad, displayImages.length])

  const observeRef = (el) => {
    if (el && observerRef.current) {
      observerRef.current.observe(el)
    }
  }

  // Distribute images into columns for masonry
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
                ref={eagerLoad ? undefined : observeRef}
                data-src={img.src}
                onClick={() => setLightboxIndex(img.globalIndex)}
              >
                <div className="gallery-item-inner">
                  {loadedImages.has(img.src) ? (
                    <img
                      src={img.src}
                      alt={img.caption}
                      className="gallery-image"
                      loading="lazy"
                    />
                  ) : (
                    <div className="gallery-placeholder" />
                  )}
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
