'use client'

import { useEffect, useCallback, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface LightboxImage {
  src: string
  alt: string
  title?: string
  id: string
  width?: number
  height?: number
}

interface LightboxProps {
  images: LightboxImage[]
  currentIndex: number
  activeId: string
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

const FLIP_TRANSITION = { duration: 0.62, ease: [0.4, 0, 0.2, 1] } as const

// Compute the display dimensions for an image so it fills the viewport maximally.
// Uses min() to pick the binding constraint (width vs height).
//   Landscape: width = min(95vw,  90vh * ratio)  → height from aspect-ratio
//   Portrait:  height = min(90vh, 95vw / ratio)  → width  from aspect-ratio
function getContainerStyle(w?: number, h?: number): React.CSSProperties {
  const ratio = w && h ? w / h : 16 / 9
  const r     = ratio.toFixed(5)

  if (ratio >= 1) {
    // Landscape / square — limit by width first, cap at 90vh
    return {
      width:       `min(95vw, calc(90vh * ${r}))`,
      aspectRatio: r,
      position:    'relative',
    }
  } else {
    // Portrait — limit by height first, cap at 95vw
    return {
      height:      `min(90vh, calc(95vw * ${(1 / ratio).toFixed(5)}))`,
      aspectRatio: r,
      position:    'relative',
    }
  }
}

export default function Lightbox({ images, currentIndex, activeId, onClose, onPrev, onNext }: LightboxProps) {
  const current = images[currentIndex]
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape')                              onClose()
      if (e.key === 'ArrowLeft')                          onPrev()
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); onNext() }
    },
    [onClose, onPrev, onNext],
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [handleKey])

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    const dy = e.changedTouches[0].clientY - touchStartY.current
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 48) dx < 0 ? onNext() : onPrev()
    touchStartX.current = null
    touchStartY.current = null
  }

  const containerStyle = getContainerStyle(current.width, current.height)

  // Track whether the full-res image has finished loading
  const [imgLoaded, setImgLoaded] = useState(false)
  // Reset whenever the displayed image changes
  useEffect(() => { setImgLoaded(false) }, [current.src])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.97)' }}
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      role="dialog"
      aria-modal="true"
      aria-label="Bildansicht"
    >
      {/* All controls are pure overlay — take zero space in the layout */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, delay: 0.38 }}
        className="contents"
      >
        {/* Close */}
        <button
          onClick={(e) => { e.stopPropagation(); onClose() }}
          className="absolute top-3 right-3 z-20 w-9 h-9 flex items-center justify-center
                     rounded-full text-white/40 hover:text-white hover:bg-white/10
                     transition-all duration-200"
          aria-label="Schließen"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>

        {/* Prev */}
        {images.length > 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); onPrev() }}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20
                       w-10 h-10 flex items-center justify-center rounded-full
                       text-white/40 hover:text-white hover:bg-white/10
                       transition-all duration-200"
            aria-label="Vorheriges Bild"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M13 3L6 10l7 7" stroke="currentColor" strokeWidth="1.4"
                    strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        {/* Next */}
        {images.length > 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); onNext() }}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20
                       w-10 h-10 flex items-center justify-center rounded-full
                       text-white/40 hover:text-white hover:bg-white/10
                       transition-all duration-200"
            aria-label="Nächstes Bild"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M7 3l7 7-7 7" stroke="currentColor" strokeWidth="1.4"
                    strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        {/* Counter + title */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20
                        flex flex-col items-center gap-1 pointer-events-none">
          {current.title && (
            <p className="text-white/60 text-[11px] tracking-[0.28em] uppercase font-sans">
              {current.title}
            </p>
          )}
          <p className="text-white/30 text-[10px] tracking-widest font-sans tabular-nums">
            {currentIndex + 1} / {images.length}
          </p>
        </div>
      </motion.div>

      {/* ── FLIP image ───────────────────────────────────────────────────────
          Container sized by viewport units (getContainerStyle).
          Landscape → 95vw width.  Portrait → 90vh height.
          Full-res loads on demand; spinner shows until onLoad fires.
      ─────────────────────────────────────────────────────────────────────── */}
      <motion.div
        layoutId={`photo-${activeId}`}
        layout
        transition={FLIP_TRANSITION}
        className="z-10 overflow-hidden"
        style={containerStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Full-res image — fades in after FLIP settles */}
        <motion.div
          key={current.src}
          initial={{ opacity: 0 }}
          animate={{ opacity: imgLoaded ? 1 : 0 }}
          transition={{ duration: 0.35 }}
          className="absolute inset-0"
        >
          <Image
            src={current.src}
            alt={current.alt}
            fill
            className="object-cover"
            sizes="95vw"
            quality={90}
            priority
            onLoad={() => setImgLoaded(true)}
          />
        </motion.div>

        {/* Spinner — visible after FLIP settles, until image is ready */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: imgLoaded ? 0 : 1 }}
          transition={{ duration: 0.2, delay: imgLoaded ? 0 : 0.5 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div className="w-7 h-7 rounded-full border-2 border-white/15 border-t-white/60 animate-spin" />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
