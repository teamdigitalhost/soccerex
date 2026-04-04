import { useEffect } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

export default function Lightbox({ image, onClose, onPrev, onNext }) {
  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose, onPrev, onNext])

  if (!image) return null

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose} aria-label="Close">
          <X size={24} />
        </button>

        <button className="lightbox-nav lightbox-prev" onClick={onPrev} aria-label="Previous">
          <ChevronLeft size={32} />
        </button>

        <div className="lightbox-image-wrapper">
          <img src={image.src} alt={image.caption} className="lightbox-image" />
          <div className="lightbox-caption">
            <p className="lightbox-caption-title">{image.caption}</p>
            <p className="lightbox-caption-event">{image.event}</p>
          </div>
        </div>

        <button className="lightbox-nav lightbox-next" onClick={onNext} aria-label="Next">
          <ChevronRight size={32} />
        </button>
      </div>
    </div>
  )
}
