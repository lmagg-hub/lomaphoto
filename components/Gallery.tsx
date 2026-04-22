'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import type { GalleryImage } from '@/types'
import { urlFor } from '@/sanity/image'
import Lightbox from './Lightbox'
import ScrollReveal from './ScrollReveal'
import { useParallax } from '@/hooks/useParallax'

const DEMO_IMAGES: Array<{ id: string; src: string; alt: string; title: string; w: number; h: number }> = [
  { id: '1', src: 'https://picsum.photos/seed/loma1/800/1100', alt: 'Portrait I',    title: 'Stille',          w: 800, h: 1100 },
  { id: '2', src: 'https://picsum.photos/seed/loma2/900/600',  alt: 'Landscape I',   title: 'Weite',           w: 900, h: 600  },
  { id: '3', src: 'https://picsum.photos/seed/loma3/800/1000', alt: 'Portrait II',   title: 'Moment',          w: 800, h: 1000 },
  { id: '4', src: 'https://picsum.photos/seed/loma4/800/800',  alt: 'Square I',      title: 'Licht',           w: 800, h: 800  },
  { id: '5', src: 'https://picsum.photos/seed/loma5/900/600',  alt: 'Landscape II',  title: 'Nebel',           w: 900, h: 600  },
  { id: '6', src: 'https://picsum.photos/seed/loma6/800/1200', alt: 'Portrait III',  title: 'Schatten',        w: 800, h: 1200 },
  { id: '7', src: 'https://picsum.photos/seed/loma7/900/700',  alt: 'Landscape III', title: 'Horizont',        w: 900, h: 700  },
  { id: '8', src: 'https://picsum.photos/seed/loma8/800/1000', alt: 'Portrait IV',   title: 'Tiefe',           w: 800, h: 1000 },
  { id: '9', src: 'https://picsum.photos/seed/loma9/900/600',  alt: 'Landscape IV',  title: 'Abenddämmerung',  w: 900, h: 600  },
]

interface NormalizedImage {
  id: string
  src: string
  lightboxSrc: string
  alt: string
  title: string
  width: number
  height: number
  lqip?: string
  animated?: boolean
}

function normalize(images: GalleryImage[]): NormalizedImage[] {
  return images
    .filter((img) => img.image?.asset)
    .map((img) => ({
      id: img._id,
      src: urlFor(img.image).width(1000).quality(85).url(),
      lightboxSrc: urlFor(img.image).width(2400).quality(90).url(),
      alt: img.alt ?? img.title ?? '',
      title: img.title ?? '',
      width: img.image.asset.metadata?.dimensions?.width ?? 800,
      height: img.image.asset.metadata?.dimensions?.height ?? 1000,
      lqip: img.image.asset.metadata?.lqip,
      animated: img.animated ?? false,
    }))
}

const FLIP_TRANSITION = { duration: 0.62, ease: [0.4, 0, 0.2, 1] } as const

export default function Gallery({ images }: { images: GalleryImage[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const bgRef = useParallax<HTMLDivElement>(0.15, 30)

  const normalized: NormalizedImage[] =
    images.length > 0
      ? normalize(images)
      : DEMO_IMAGES.map((d) => ({ id: d.id, src: d.src, lightboxSrc: d.src, alt: d.alt, title: d.title, width: d.w, height: d.h, lqip: undefined }))

  // id of the thumbnail currently shown in lightbox (drives layoutId)
  const activeId = lightboxIndex !== null ? (normalized[lightboxIndex]?.id ?? null) : null

  const lightboxImages = normalized.map((img) => ({
    src: img.lightboxSrc,
    alt: img.alt,
    title: img.title,
    id: img.id,
    width: img.width,
    height: img.height,
  }))

  return (
    // LayoutGroup lets layoutId work across the grid AND the Lightbox portal
    <LayoutGroup>
      <section id="galerie" className="relative py-24 md:py-32 px-6 md:px-10 max-w-7xl mx-auto">
        {/* Parallax background glow */}
        <div
          ref={bgRef}
          className="absolute pointer-events-none -z-10"
          style={{
            inset: '-80px',
            background: 'radial-gradient(ellipse 70% 40% at 50% 55%, rgba(201,169,110,0.05) 0%, transparent 70%)',
          }}
        />

        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="section-heading">Galerie</h2>
            <p className="section-subheading">Ausgewählte Arbeiten</p>
          </div>
        </ScrollReveal>

        <div className="masonry-grid">
          {normalized.map((img, index) => (
            // Outer div: scroll-reveal animation only (no layoutId = no transform conflict)
            <motion.div
              key={img.id}
              initial={{ opacity: 0, x: -38 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 1.0, delay: (index % 3) * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
              className="masonry-item group relative cursor-pointer"
              onClick={() => setLightboxIndex(index)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setLightboxIndex(index) } }}
              role="button"
              tabIndex={0}
              aria-label={`Foto vergrößern: ${img.title || img.alt}`}
            >
              {/* Inner div: FLIP source element — hides instantly when active so the
                  flying Lightbox image is unobstructed; shows immediately on close so
                  the "landing spot" is visible as the image returns */}
              <motion.div
                layoutId={`photo-${img.id}`}
                transition={FLIP_TRANSITION}
                style={{ opacity: activeId === img.id ? 0 : 1 }}
              >
                <div className={`relative overflow-hidden bg-dark-200${img.animated ? ' cine-breathe' : ''}`}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={img.width}
                    height={img.height}
                    loading="lazy"
                    placeholder={img.lqip ? 'blur' : 'empty'}
                    blurDataURL={img.lqip}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex flex-col items-center justify-center gap-3">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-light"
                    >
                      <circle cx="14" cy="14" r="13" stroke="currentColor" strokeWidth="1" />
                      <path d="M10 14h8M14 10v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <p className="text-light text-xs tracking-widest uppercase font-sans opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-1 group-hover:translate-y-0">
                      {img.title}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* "Zur Galerie" link */}
        <ScrollReveal>
          <div className="text-center mt-16">
            <Link href="/galerie" className="btn-primary">
              Zur Galerie
            </Link>
          </div>
        </ScrollReveal>

        {/* AnimatePresence here (not inside Lightbox) so exit animations play on unmount */}
        <AnimatePresence>
          {lightboxIndex !== null && (
            <Lightbox
              images={lightboxImages}
              currentIndex={lightboxIndex}
              activeId={activeId!}
              onClose={() => setLightboxIndex(null)}
              onPrev={() => setLightboxIndex((i) => (i! - 1 + normalized.length) % normalized.length)}
              onNext={() => setLightboxIndex((i) => (i! + 1) % normalized.length)}
            />
          )}
        </AnimatePresence>
      </section>
    </LayoutGroup>
  )
}
