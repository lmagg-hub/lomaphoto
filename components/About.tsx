'use client'

import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import type { About } from '@/types'
import { urlFor } from '@/sanity/image'
import ScrollReveal from './ScrollReveal'

const DEMO_BIO = [
  {
    _type: 'block' as const,
    _key: '1',
    style: 'normal',
    children: [
      {
        _type: 'span' as const,
        _key: 's1',
        text: 'Hinter der Linse stehe ich — Lorenz Magg, Fotograf und Videograf aus Österreich.',
        marks: ['strong'],
      },
    ],
    markDefs: [],
  },
  {
    _type: 'block' as const,
    _key: '2',
    style: 'normal',
    children: [
      {
        _type: 'span' as const,
        _key: 's2',
        text: 'Meine Arbeit dreht sich um Stimmung, Licht und Augenblicke — die flüchtigen Momente, die eine Geschichte erzählen. Von intimen Portraits bis zu weitläufigen Landschaften, von Hochzeitsfilmen bis zu kommerziellen Projekten.',
        marks: [],
      },
    ],
    markDefs: [],
  },
  {
    _type: 'block' as const,
    _key: '3',
    style: 'normal',
    children: [
      {
        _type: 'span' as const,
        _key: 's3',
        text: 'Mich fasziniert das Zusammenspiel von Dunkel und Licht — die Schönheit liegt oft im Verborgenen, im gerade noch Sichtbaren.',
        marks: [],
      },
    ],
    markDefs: [],
  },
]

const portableComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="text-light-muted font-sans text-base leading-relaxed mb-5">{children}</p>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="font-serif text-2xl font-light text-light mb-4">{children}</h3>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-normal text-light">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="italic text-gold">{children}</em>
    ),
  },
}

export default function AboutSection({ about }: { about: About | null }) {
  const bio = about?.bio ?? DEMO_BIO
  const imageSrc = about?.image ? urlFor(about.image).width(800).url() : 'https://picsum.photos/seed/about1/600/800'
  const imageAlt = about?.imageAlt ?? 'Lorenz Magg — lomaphoto'

  return (
    <section id="ueber-mich" className="py-24 md:py-32 bg-dark-100">
      <div className="px-6 md:px-10 max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="section-heading">Über mich</h2>
            <p className="section-subheading">Der Mensch hinter der Kamera</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Image */}
          <ScrollReveal direction="left">
            <div className="relative aspect-[3/4] overflow-hidden bg-dark-200">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Decorative border offset */}
              <div className="absolute -bottom-3 -right-3 w-full h-full border border-dark-300 -z-10" />
            </div>
          </ScrollReveal>

          {/* Text */}
          <ScrollReveal direction="right" delay={0.2}>
            <div>
              <p className="text-gold text-xs tracking-[0.4em] uppercase font-sans mb-6">
                lomaphoto
              </p>
              <h3 className="font-serif text-3xl md:text-4xl font-light text-light mb-8 leading-tight">
                Lorenz Magg
              </h3>
              <div className="prose prose-invert max-w-none">
                <PortableText value={bio} components={portableComponents} />
              </div>

              <div className="mt-10 pt-8 border-t border-dark-200 flex gap-10">
                <div>
                  <p className="font-serif text-3xl font-light text-gold mb-1">∞</p>
                  <p className="text-[10px] tracking-widest uppercase text-light-dim font-sans">Leidenschaft</p>
                </div>
                <div>
                  <p className="font-serif text-3xl font-light text-gold mb-1">AT</p>
                  <p className="text-[10px] tracking-widest uppercase text-light-dim font-sans">Österreich</p>
                </div>
                <div>
                  <p className="font-serif text-3xl font-light text-gold mb-1">24</p>
                  <p className="text-[10px] tracking-widest uppercase text-light-dim font-sans">Stunden Licht</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
