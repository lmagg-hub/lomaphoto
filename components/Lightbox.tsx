'use client'

import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface LightboxProps {
  images: Array<{ src: string; alt: string; title?: string }>
  currentIndex: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export default function Lightbox({ images, currentIndex, onClose, onPrev, onNext }: LightboxProps) {
  const current = images[currentIndex]

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
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

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
        onClick={onClose}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-10 text-light-muted hover:text-light transition-colors p-2"
          aria-label="Schließen"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Counter */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 text-xs tracking-widest text-light-dim font-sans">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Prev */}
        {images.length > 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); onPrev() }}
            className="absolute left-4 md:left-8 z-10 p-3 text-light-muted hover:text-light transition-colors"
            aria-label="Vorheriges Bild"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Image */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative max-w-[90vw] max-h-[85vh] mx-16"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={current.src}
            alt={current.alt}
            width={1200}
            height={900}
            className="object-contain max-h-[85vh] w-auto h-auto"
            priority
          />
          {current.title && (
            <p className="text-center text-xs tracking-widest text-light-dim mt-4 font-sans uppercase">
              {current.title}
            </p>
          )}
        </motion.div>

        {/* Next */}
        {images.length > 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); onNext() }}
            className="absolute right-4 md:right-8 z-10 p-3 text-light-muted hover:text-light transition-colors"
            aria-label="Nächstes Bild"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
