'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import Image from 'next/image'
import {
  motion, AnimatePresence, LayoutGroup,
  useMotionValue, useSpring, useTransform,
  type MotionValue,
} from 'framer-motion'
import type { GalleryImage } from '@/types'
import { urlFor } from '@/sanity/image'
import Lightbox from './Lightbox'

// ── constants ────────────────────────────────────────────────────────────────

function seeded(n: number): number {
  const x = Math.sin(n + 1) * 10000
  return x - Math.floor(x)
}

const FLIP    = { duration: 0.62, ease: [0.4, 0, 0.2, 1] } as const
const CARD_W  = 185
const CARD_H  = 250
const MAX_PX  = 22
const ARC_DIP = 60
const MAX_ROT = 11

// ── demo data ────────────────────────────────────────────────────────────────

const DEMOS = [
  { id: 'd1', src: 'https://picsum.photos/seed/sc1/800/1100', alt: 'Portrait I',    title: 'Stille',          w: 800,  h: 1100 },
  { id: 'd2', src: 'https://picsum.photos/seed/sc2/900/600',  alt: 'Landscape I',   title: 'Weite',           w: 900,  h: 600  },
  { id: 'd3', src: 'https://picsum.photos/seed/sc3/800/1000', alt: 'Portrait II',   title: 'Moment',          w: 800,  h: 1000 },
  { id: 'd4', src: 'https://picsum.photos/seed/sc4/800/800',  alt: 'Square I',      title: 'Licht',           w: 800,  h: 800  },
  { id: 'd5', src: 'https://picsum.photos/seed/sc5/900/600',  alt: 'Landscape II',  title: 'Nebel',           w: 900,  h: 600  },
  { id: 'd6', src: 'https://picsum.photos/seed/sc6/800/1200', alt: 'Portrait III',  title: 'Schatten',        w: 800,  h: 1200 },
  { id: 'd7', src: 'https://picsum.photos/seed/sc7/900/700',  alt: 'Landscape III', title: 'Horizont',        w: 900,  h: 700  },
  { id: 'd8', src: 'https://picsum.photos/seed/sc8/800/1000', alt: 'Portrait IV',   title: 'Tiefe',           w: 800,  h: 1000 },
  { id: 'd9', src: 'https://picsum.photos/seed/sc9/900/600',  alt: 'Landscape IV',  title: 'Abenddämmerung',  w: 900,  h: 600  },
]

// ── types ────────────────────────────────────────────────────────────────────

interface RawImage {
  id: string; src: string; lightboxSrc: string; alt: string; title: string
  width: number; height: number; lqip?: string
}

interface FanItem extends RawImage {
  fanX: number; fanY: number; rot: number; pf: number; zBase: number
}

type Breakpoint = 'mobile' | 'tablet' | 'desktop'

// ── helpers ──────────────────────────────────────────────────────────────────

function toRaw(images: GalleryImage[]): RawImage[] {
  if (images.length === 0) {
    return DEMOS.map(d => ({
      id: d.id, src: d.src, lightboxSrc: d.src, alt: d.alt, title: d.title,
      width: d.w, height: d.h, lqip: undefined,
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
      id: i._id,
      src:         urlFor(i.image).width(800).quality(85).url(),
      lightboxSrc: urlFor(i.image).width(2400).quality(90).url(),
      alt: i.alt ?? i.title ?? '',
      title: i.title ?? '',
      width:  i.image.asset.metadata?.dimensions?.width  ?? 800,
      height: i.image.asset.metadata?.dimensions?.height ?? 1000,
      lqip:   i.image.asset.metadata?.lqip,
    }))
}

function buildFan(raw: RawImage[], spreadX: number): FanItem[] {
  const n = raw.length
  return raw.map((img, i) => {
    const t     = n === 1 ? 0 : (2 * i / (n - 1)) - 1
    const tAbs  = Math.abs(t)
    const noise = (seeded(i * 11 + 5) - 0.5) * 5
    return {
      ...img,
      fanX:  t * spreadX,
      fanY:  t * t * ARC_DIP,
      rot:   t * MAX_ROT + noise,
      pf:    1 - tAbs * 0.6,
      zBase: n - Math.round(tAbs * (n - 1)),
    }
  })
}

// ── FanCard (hooks-per-card via sub-component) ───────────────────────────────

interface CardProps {
  item: FanItem
  smoothX: MotionValue<number>
  smoothY: MotionValue<number>
  isHovered: boolean
  activeId: string | null
  onClick: () => void
  onHoverStart: () => void
  onHoverEnd: () => void
}

function FanCard({ item, smoothX, smoothY, isHovered, activeId, onClick, onHoverStart, onHoverEnd }: CardProps) {
  const liftTarget = useMotionValue(0)
  const lift = useSpring(liftTarget, { stiffness: 400, damping: 30 })
  useEffect(() => { liftTarget.set(isHovered ? -24 : 0) }, [isHovered, liftTarget])

  const x = useTransform(smoothX, (v: number) => item.fanX + v * MAX_PX * item.pf)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const y = useTransform([smoothY, lift] as any, ([sy, l]: number[]) =>
    item.fanY + (sy as number) * MAX_PX * item.pf * 0.55 + (l as number)
  )

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: '50%', top: '50%',
        marginLeft: `-${CARD_W / 2}px`,
        marginTop:  `-${CARD_H / 2}px`,
        width: CARD_W, height: CARD_H,
        x, y,
        rotate: item.rot,
        zIndex: isHovered ? 500 : item.zBase,
      }}
      animate={{ scale: isHovered ? 1.07 : 1 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      onClick={onClick}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      className="cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick() } }}
      aria-label={`Foto öffnen: ${item.title || item.alt}`}
    >
      <motion.div
        layoutId={`photo-${item.id}`}
        transition={FLIP}
        style={{ width: '100%', height: '100%', opacity: activeId === item.id ? 0 : 1 }}
      >
        <div
          className="relative w-full h-full overflow-hidden"
          style={{
            borderRadius: '2px',
            boxShadow: isHovered
              ? '0 28px 64px rgba(0,0,0,0.9), 0 8px 24px rgba(0,0,0,0.6)'
              : '0 8px 28px rgba(0,0,0,0.7), 0 2px 8px rgba(0,0,0,0.45)',
            transition: 'box-shadow 0.3s ease',
          }}
        >
          <Image
            src={item.src} alt={item.alt} fill
            className="object-cover" sizes="200px" loading="eager"
            placeholder={item.lqip ? 'blur' : 'empty'}
            blurDataURL={item.lqip}
          />
          <motion.div
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 6 }}
            transition={{ duration: 0.18 }}
            className="absolute bottom-0 left-0 right-0 px-2 pb-2.5 pt-6"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 100%)' }}
          >
            <p className="text-white text-[10px] tracking-[0.22em] uppercase font-sans text-center">
              {item.title || item.alt}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── MobileGrid ────────────────────────────────────────────────────────────────

interface GridProps {
  items: RawImage[]
  activeId: string | null
  onOpen: (i: number) => void
}

function MobileGrid({ items, activeId, onOpen }: GridProps) {
  return (
    <div className="px-4 pb-20">
      <div className="grid grid-cols-2 gap-3">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, delay: (index % 2) * 0.07 }}
            onClick={() => onOpen(index)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(index) } }}
            role="button"
            tabIndex={0}
            className="cursor-pointer"
            aria-label={`Foto öffnen: ${item.title || item.alt}`}
          >
            <motion.div
              layoutId={`photo-${item.id}`}
              transition={FLIP}
              style={{ opacity: activeId === item.id ? 0 : 1 }}
            >
              <div
                className="relative overflow-hidden"
                style={{ borderRadius: '2px', boxShadow: '0 4px 16px rgba(0,0,0,0.5)' }}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                  placeholder={item.lqip ? 'blur' : 'empty'}
                  blurDataURL={item.lqip}
                  sizes="50vw"
                />
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ── ScatteredGallery ──────────────────────────────────────────────────────────

export default function ScatteredGallery({ images }: { images: GalleryImage[] }) {
  const raw = useMemo(() => toRaw(images), [images])

  // mounted guard — SSR and initial client render are identical (placeholder),
  // avoiding any hydration mismatch from window-dependent state.
  const [mounted, setMounted] = useState(false)

  // Responsive breakpoint + fan spread — computed client-side after mount
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('desktop')
  const [spreadX,    setSpreadX]    = useState(440)

  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth
      if (w < 768) {
        setBreakpoint('mobile')
      } else if (w < 1024) {
        setBreakpoint('tablet')
        setSpreadX(Math.min(280, w * 0.34))
      } else {
        setBreakpoint('desktop')
        setSpreadX(Math.min(440, w * 0.41))
      }
    }
    compute()
    setMounted(true)
    window.addEventListener('resize', compute)
    return () => window.removeEventListener('resize', compute)
  }, [])

  const fanItems = useMemo(() => buildFan(raw, spreadX), [raw, spreadX])

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [hoveredIndex,  setHoveredIndex]  = useState<number | null>(null)

  // Cursor tracking (fan/tablet only — unused on mobile)
  const rawX    = useMotionValue(0)
  const rawY    = useMotionValue(0)
  const smoothX = useSpring(rawX, { stiffness: 60, damping: 20 })
  const smoothY = useSpring(rawY, { stiffness: 60, damping: 20 })

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    rawX.set((e.clientX / window.innerWidth  - 0.5) * 2)
    rawY.set((e.clientY / window.innerHeight - 0.5) * 2)
  }, [rawX, rawY])

  const onMouseLeave = useCallback(() => {
    rawX.set(0)
    rawY.set(0)
  }, [rawX, rawY])

  const activeId = lightboxIndex !== null ? (raw[lightboxIndex]?.id ?? null) : null
  const lightboxImages = raw.map(img => ({
    src: img.lightboxSrc,
    alt: img.alt, title: img.title,
    id: img.id, width: img.width, height: img.height,
  }))

  // ── Pre-mount: render nothing — server and client initial output match exactly
  if (!mounted) {
    return <div style={{ minHeight: '72vh' }} aria-hidden="true" />
  }

  // ── Mobile: clean 2-column grid ────────────────────────────────────────────
  if (breakpoint === 'mobile') {
    return (
      <LayoutGroup>
        <MobileGrid
          items={raw}
          activeId={activeId}
          onOpen={setLightboxIndex}
        />
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

  // ── Tablet / Desktop: fan spread ───────────────────────────────────────────
  return (
    <LayoutGroup>
      <div
        className="relative flex flex-col items-center justify-center pb-32"
        style={{ minHeight: '72vh', paddingTop: '16px' }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        <p className="text-white/20 text-[11px] tracking-[0.3em] uppercase font-sans mb-10 select-none">
          {raw.length}&nbsp;{raw.length === 1 ? 'Bild' : 'Bilder'} — Klicken zum Öffnen
        </p>

        <div
          style={{
            position: 'relative',
            width: breakpoint === 'tablet' ? 'min(780px, 93vw)' : 'min(1050px, 93vw)',
            height: `${CARD_H + ARC_DIP + 40}px`,
            overflow: 'visible',
          }}
        >
          {fanItems.map((item, index) => (
            <FanCard
              key={item.id}
              item={item}
              smoothX={smoothX}
              smoothY={smoothY}
              isHovered={hoveredIndex === index}
              activeId={activeId}
              onClick={() => setLightboxIndex(index)}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
            />
          ))}
        </div>

        <p className="text-white/15 text-[10px] tracking-[0.2em] uppercase font-sans mt-24 select-none">
          ← Pfeiltasten oder Wischen →
        </p>
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
