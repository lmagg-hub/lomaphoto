'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { ShopTeaser } from '@/types'
import { urlFor } from '@/sanity/image'
import ScrollReveal from './ScrollReveal'
import { useParallax } from '@/hooks/useParallax'

const PLACEHOLDERS = [
  'https://picsum.photos/seed/teaser1/600/750',
  'https://picsum.photos/seed/teaser2/600/750',
  'https://picsum.photos/seed/teaser3/600/750',
]

export default function Shop({ teasers }: { teasers: ShopTeaser[] }) {
  const items = teasers.length > 0 ? teasers : [null, null, null]
  const bgRef = useParallax<HTMLDivElement>(0.2, 30)

  return (
    <section id="shop" className="relative py-24 md:py-32 bg-dark-100">
      {/* Parallax background glow — shifts at 0.4× scroll speed */}
      <div
        ref={bgRef}
        className="absolute pointer-events-none -z-10"
        style={{
          inset: '-80px',
          background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(201,169,110,0.06) 0%, transparent 65%)',
        }}
      />
      <div className="px-6 md:px-10 max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="section-heading">Fine Art Prints</h2>
            <p className="text-light-muted font-sans text-base mt-4 max-w-md mx-auto leading-relaxed">
              Aludibond-Drucke in handgefertigten Schattenfugenrahmen aus Holz.
            </p>
          </div>
        </ScrollReveal>

        {/* Preview images */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-14">
          {items.map((teaser, idx) => {
            const src = teaser?.image?.asset
              ? urlFor(teaser.image).width(600).height(750).url()
              : PLACEHOLDERS[idx]
            const alt = teaser?.image?.alt ?? teaser?.title ?? 'Fine Art Print'

            return (
              <motion.div
                key={teaser?._id ?? idx}
                initial={{ opacity: 0, x: -38 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 1.0, delay: idx * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <Link
                  href="/shop"
                  className="group block relative overflow-hidden bg-dark-200 aspect-[4/5]"
                >
                  {/* cine-drift wrapper is 106% wide so the 2.5px drift never exposes edges */}
                  <div className="cine-drift absolute inset-0" style={{ width: '106%', left: '-3%' }}>
                    <Image
                      src={src}
                      alt={alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* CTA */}
        <ScrollReveal>
          <div className="text-center">
            <Link
              href="/shop"
              className="inline-block px-12 py-4 text-sm tracking-widest uppercase border border-gold text-gold hover:bg-gold hover:text-dark transition-all duration-300 font-sans"
            >
              Zum Shop
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
