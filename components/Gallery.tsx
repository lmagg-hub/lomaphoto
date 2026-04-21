'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import type { GalleryImage } from '@/types'
import { urlFor } from '@/sanity/image'
import Lightbox from './Lightbox'
import ScrollReveal from './ScrollReveal'

const DEMO_IMAGES: Array<{ id: string; src: string; alt: string; title: string; w: number; h: number }> = [
  { id: '1', src: 'https://picsum.photos/seed/loma1/800/1100', alt: 'Portrait I', title: 'Stille', w: 800, h: 1100 },
  { id: '2', src: 'https://picsum.photos/seed/loma2/900/600', alt: 'Landscape I', title: 'Weite', w: 900, h: 600 },
  { id: '3', src: 'https://picsum.photos/seed/loma3/800/1000', alt: 'Portrait II', title: 'Moment', w: 800, h: 1000 },
  { id: '4', src: 'https://picsum.photos/seed/loma4/800/800', alt: 'Square I', title: 'Licht', w: 800, h: 800 },
  { id: '5', src: 'https://picsum.photos/seed/loma5/900/600', alt: 'Landscape II', title: 'Nebel', w: 900, h: 600 },
  { id: '6', src: 'https://picsum.photos/seed/loma6/800/1200', alt: 'Portrait III', title: 'Schatten', w: 800, h: 1200 },
  { id: '7', src: 'https://picsum.photos/seed/loma7/900/700', alt: 'Landscape III', title: 'Horizont', w: 900, h: 700 },
  { id: '8', src: 'https://picsum.photos/seed/loma8/800/1000', alt: 'Portrait IV', title: 'Tiefe', w: 800, h: 1000 },
  { id: '9', src: 'https://picsum.photos/seed/loma9/900/600', alt: 'Landscape IV', title: 'Abenddämmerung', w: 900, h: 600 },
]

interface NormalizedImage {
  id: string
  src: string
  alt: string
  title: string
  width: number
  height: number
}

function normalize(images: GalleryImage[]): NormalizedImage[] {
  return images
    .filter((img) => img.image?.asset)
    .map((img) => ({
      id: img._id,
      src: urlFor(img.image).width(1200).url(),
      alt: img.alt ?? img.title ?? '',
      title: img.title ?? '',
      width: img.image.asset.metadata?.dimensions?.width ?? 800,
      height: img.image.asset.metadata?.dimensions?.height ?? 1000,
    }))
}

export default function Gallery({ images }: { images: GalleryImage[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const normalized: NormalizedImage[] =
    images.length > 0
      ? normalize(images)
      : DEMO_IMAGES.map((d) => ({ id: d.id, src: d.src, alt: d.alt, title: d.title, width: d.w, height: d.h }))

  const lightboxImages = normalized.map((img) => ({ src: img.src, alt: img.alt, title: img.title }))

  return (
    <section id="galerie" className="py-24 md:py-32 px-6 md:px-10 max-w-7xl mx-auto">
      <ScrollReveal>
        <div className="text-center mb-16">
          <h2 className="section-heading">Galerie</h2>
          <p className="section-subheading">Ausgewählte Arbeiten</p>
        </div>
      </ScrollReveal>

      <div className="masonry-grid">
        {normalized.map((img, index) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 0, x: -38 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.0, delay: (index % 3) * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
            className="masonry-item group relative cursor-pointer overflow-hidden"
            onClick={() => setLightboxIndex(index)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setLightboxIndex(index) } }}
            role="button"
            tabIndex={0}
            aria-label={`Foto vergrößern: ${img.title || img.alt}`}
          >
            <div className="relative overflow-hidden bg-dark-200">
              <Image
                src={img.src}
                alt={img.alt}
                width={img.width}
                height={img.height}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-500 flex items-end p-5">
                <p className="text-light text-xs tracking-widest uppercase font-sans opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                  {img.title}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={lightboxImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((i) => (i! - 1 + normalized.length) % normalized.length)}
          onNext={() => setLightboxIndex((i) => (i! + 1) % normalized.length)}
        />
      )}
    </section>
  )
}
