'use client'

import { useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface LightboxImage {
  src: string
  alt: string
  title?: string
  id: string
}

interface LightboxProps {
  images: LightboxImage[]
  currentIndex: number
  activeId: string        // id of the image currently shown — drives layoutId
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

const FLIP_TRANSITION = { duration: 0.62, ease: [0.4, 0, 0.2, 1] } as const

export default function Lightbox({ images, currentIndex, activeId, onClose, onPrev, onNext }: LightboxProps) {
  const current = images[currentIndex]
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)

  // Keyboard + body scroll lock
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); onNext() }
    },
    [onClose, onPrev, onNext]
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
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 48) {
      dx < 0 ? onNext() : onPrev()
    }
    touchStartX.current = null
    touchStartY.current = null
  }

  return (
    // Overlay — fades in/out independently of the FLIP image
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.95)' }}
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      role="dialog"
      aria-modal="true"
      aria-label="Bildansicht"
    >
      {/* Controls fade in slightly after FLIP settles */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, delay: 0.35 }}
        className="contents"
      >
        {/* Close */}
        <button
          onClick={(e) => { e.stopPropagation(); onClose() }}
          className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
          aria-label="Schließen"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* Prev */}
        {images.length > 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); onPrev() }}
            className="absolute left-3 md:left-6 z-20 w-11 h-11 flex items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200"
            aria-label="Vorheriges Bild"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <path d="M14 4L7 11l7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        {/* Next */}
        {images.length > 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); onNext() }}
            className="absolute right-3 md:right-6 z-20 w-11 h-11 flex items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200"
            aria-label="Nächstes Bild"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <path d="M8 4l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        {/* Counter + title — below the image */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-20">
          {current.title && (
            <p className="text-white/70 text-xs tracking-[0.25em] uppercase font-sans">
              {current.title}
            </p>
          )}
          <p className="text-white/35 text-[11px] tracking-widest font-sans tabular-nums">
            {currentIndex + 1} / {images.length}
          </p>
        </div>
      </motion.div>

      {/* ── FLIP image ──────────────────────────────────────────────────────
          layoutId matches the gallery thumbnail → Framer Motion animates
          position + size from thumbnail rect to this centered rect.
          When navigating, activeId changes → old image flies back to its
          thumbnail, new image flies in from its thumbnail. Magic.
      ──────────────────────────────────────────────────────────────────── */}
      <motion.div
        layoutId={`photo-${activeId}`}
        layout
        transition={FLIP_TRANSITION}
        className="relative z-10"
        style={{ maxWidth: '90vw', maxHeight: '80vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image content fades in after FLIP has mostly settled (looks cleaner
            than showing the thumbnail content stretching to fullscreen size) */}
        <motion.div
          key={current.src}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.42 }}
        >
          <Image
            src={current.src}
            alt={current.alt}
            width={1400}
            height={1050}
            className="object-contain"
            style={{ maxWidth: '90vw', maxHeight: '78vh', width: 'auto', height: 'auto' }}
            priority
          />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
