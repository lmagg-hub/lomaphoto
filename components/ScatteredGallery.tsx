'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import Masonry from 'react-masonry-css'
import type { GalleryImage } from '@/types'
import { urlFor } from '@/sanity/image'
import Lightbox from './Lightbox'

// ── demo data ─────────────────────────────────────────────────────────────────

const DEMOS = [
  { id: 'd1',  src: 'https://picsum.photos/seed/sc1/800/1100',  alt: 'Portrait I',     title: 'Stille',          w: 800,  h: 1100 },
  { id: 'd2',  src: 'https://picsum.photos/seed/sc2/900/600',   alt: 'Landscape I',    title: 'Weite',           w: 900,  h: 600  },
  { id: 'd3',  src: 'https://picsum.photos/seed/sc3/800/1000',  alt: 'Portrait II',    title: 'Moment',          w: 800,  h: 1000 },
  { id: 'd4',  src: 'https://picsum.photos/seed/sc4/800/800',   alt: 'Square I',       title: 'Licht',           w: 800,  h: 800  },
  { id: 'd5',  src: 'https://picsum.photos/seed/sc5/900/600',   alt: 'Landscape II',   title: 'Nebel',           w: 900,  h: 600  },
  { id: 'd6',  src: 'https://picsum.photos/seed/sc6/800/1200',  alt: 'Portrait III',   title: 'Schatten',        w: 800,  h: 1200 },
  { id: 'd7',  src: 'https://picsum.photos/seed/sc7/900/700',   alt: 'Landscape III',  title: 'Horizont',        w: 900,  h: 700  },
  { id: 'd8',  src: 'https://picsum.photos/seed/sc8/800/1000',  alt: 'Portrait IV',    title: 'Tiefe',           w: 800,  h: 1000 },
  { id: 'd9',  src: 'https://picsum.photos/seed/sc9/900/600',   alt: 'Landscape IV',   title: 'Abenddämmerung',  w: 900,  h: 600  },
  { id: 'd10', src: 'https://picsum.photos/seed/sc10/800/1100', alt: 'Portrait V',     title: 'Stimmung',        w: 800,  h: 1100 },
  { id: 'd11', src: 'https://picsum.photos/seed/sc11/900/600',  alt: 'Landscape V',    title: 'Morgen',          w: 900,  h: 600  },
  { id: 'd12', src: 'https://picsum.photos/seed/sc12/800/900',  alt: 'Portrait VI',    title: 'Ruhe',            w: 800,  h: 900  },
]

// ── types & normalization ─────────────────────────────────────────────────────

interface RawImage {
  id: string; src: string; lightboxSrc: string
  alt: string; title: string
  width: number; height: number; lqip?: string
}

function toRaw(images: GalleryImage[]): RawImage[] {
  if (images.length === 0) {
    return DEMOS.map(d => ({
      id: d.id, src: d.src, lightboxSrc: d.src, alt: d.alt, title: d.title,
      width: d.w, height: d.h,
    }))
  }

  const seenIds    = new Set<string>()
  const seenAssets = new Set<string>()

  return images
    .filter(i => i.image?.asset)
    .filter(i => {
      if (seenIds.has(i._id)) return false
      seenIds.add(i._id)
      const assetId = i.image.asset._id
      if (assetId && seenAssets.has(assetId)) return false
      if (assetId) seenAssets.add(assetId)
      return true
    })
    .map(i => ({
      id:          i._id,
      src:         urlFor(i.image).width(900).quality(85).url(),
      lightboxSrc: urlFor(i.image).width(2400).quality(90).url(),
      alt:         i.alt   ?? i.title ?? '',
      title:       i.title ?? '',
      width:       i.image.asset.metadata?.dimensions?.width  ?? 800,
      height:      i.image.asset.metadata?.dimensions?.height ?? 1000,
      lqip:        i.image.asset.metadata?.lqip,
    }))
}

// ── constants ─────────────────────────────────────────────────────────────────

const FLIP = { duration: 0.62, ease: [0.4, 0, 0.2, 1] } as const

const BREAKPOINTS = {
  default: 4,   // ≥1024px — 4 columns
  1024:    3,   // 768–1024px — 3 columns
  768:     2,   // <768px — 2 columns
}

// ── ScatteredGallery ──────────────────────────────────────────────────────────

export default function ScatteredGallery({ images }: { images: GalleryImage[] }) {
  const raw = useMemo(() => toRaw(images), [images])

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const activeId       = lightboxIndex !== null ? (raw[lightboxIndex]?.id ?? null) : null
  const lightboxImages = raw.map(img => ({
    src: img.lightboxSrc, alt: img.alt, title: img.title,
    id: img.id, width: img.width, height: img.height,
  }))

  if (raw.length === 0) {
    return (
      <p className="text-white/30 text-sm font-sans text-center py-20">
        Noch keine Bilder vorhanden.
      </p>
    )
  }

  return (
    <LayoutGroup>
      <div className="px-6 md:px-10 max-w-7xl mx-auto pb-24">
        <Masonry
          breakpointCols={BREAKPOINTS}
          className="gallery-masonry"
          columnClassName="gallery-masonry-col"
        >
          {raw.map((img, index) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{
                duration: 0.75,
                delay: (index % 6) * 0.05,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="group relative cursor-pointer"
              onClick={() => setLightboxIndex(index)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setLightboxIndex(index)
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`Foto öffnen: ${img.title || img.alt}`}
            >
              <motion.div
                layoutId={`photo-${img.id}`}
                transition={FLIP}
                style={{ opacity: activeId === img.id ? 0 : 1 }}
              >
                <div className="relative overflow-hidden bg-dark-200">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={img.width}
                    height={img.height}
                    loading={index < 8 ? 'eager' : 'lazy'}
                    placeholder={img.lqip ? 'blur' : 'empty'}
                    blurDataURL={img.lqip}
                    className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex flex-col items-center justify-center gap-3">
                    <svg
                      width="26" height="26" viewBox="0 0 28 28" fill="none"
                      aria-hidden="true"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-light"
                    >
                      <circle cx="14" cy="14" r="13" stroke="currentColor" strokeWidth="1" />
                      <path d="M10 14h8M14 10v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    {img.title && (
                      <p className="text-light text-xs tracking-widest uppercase font-sans opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0 px-3 text-center">
                        {img.title}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </Masonry>
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={lightboxImages}
            currentIndex={lightboxIndex}
            activeId={activeId!}
            onClose={() => setLightboxIndex(null)}
            onPrev={() => setLightboxIndex(i => (i! - 1 + raw.length) % raw.length)}
            onNext={() => setLightboxIndex(i => (i! + 1) % raw.length)}
          />
        )}
      </AnimatePresence>
    </LayoutGroup>
  )
}
