'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import type { VideoProject } from '@/types'
import { urlFor } from '@/sanity/image'
import ScrollReveal from './ScrollReveal'

// ── helpers ───────────────────────────────────────────────────────────────────

function getVideoId(url: string): string | null {
  return url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)?.[1] ?? null
}

function getEmbedUrl(url: string): string {
  const ytId = getVideoId(url)
  if (ytId) return `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&controls=0&modestbranding=1&showinfo=0`
  const vimeo = url.match(/vimeo\.com\/(\d+)/)
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1`
  return url
}

function getYtThumb(url: string): string | null {
  const id = getVideoId(url)
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null
}

// ── types & normalization ─────────────────────────────────────────────────────

interface VideoItem {
  id: string
  title: string
  description?: string
  videoUrl: string
  thumbSrc: string
  category?: string
  featured: boolean
}

const DEMOS: VideoItem[] = [
  {
    id: 'd1', title: 'Showreel 2024',
    description: 'Ein Querschnitt meiner besten Arbeiten aus dem vergangenen Jahr.',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbSrc: 'https://picsum.photos/seed/vid1/1280/720',
    category: 'showreel', featured: true,
  },
  { id: 'd2', title: 'Wedding Film — M & S', description: 'Hochzeitsfilm im alpinen Ambiente.', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbSrc: 'https://picsum.photos/seed/vid2/800/450', category: 'wedding', featured: false },
  { id: 'd3', title: 'Commercial — Brand X', description: 'Produktfilm mit kinematografischer Bildsprache.', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbSrc: 'https://picsum.photos/seed/vid3/800/450', category: 'commercial', featured: false },
  { id: 'd4', title: 'Documentary — Tirol', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbSrc: 'https://picsum.photos/seed/vid4/800/450', category: 'documentary', featured: false },
  { id: 'd5', title: 'Music Video — Indie', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbSrc: 'https://picsum.photos/seed/vid5/800/450', category: 'music', featured: false },
]

function normalize(videos: VideoProject[]): VideoItem[] {
  if (videos.length === 0) return DEMOS
  return videos.map(v => ({
    id: v._id,
    title: v.title,
    description: v.description,
    videoUrl: v.videoUrl,
    thumbSrc: v.thumbnail
      ? urlFor(v.thumbnail).width(1280).quality(85).url()
      : (getYtThumb(v.videoUrl) ?? 'https://picsum.photos/seed/fallback/1280/720'),
    category: v.category,
    featured: v.featured,
  }))
}

// ── PlayIcon ──────────────────────────────────────────────────────────────────

function PlayIcon({ size }: { size: number }) {
  return (
    <div
      className="rounded-full border border-white/40 flex items-center justify-center bg-black/40 backdrop-blur-sm group-hover:border-gold group-hover:bg-black/60 transition-all duration-300"
      style={{ width: size, height: size, flexShrink: 0 }}
    >
      <svg width={size * 0.38} height={size * 0.38} viewBox="0 0 24 24" fill="currentColor" className="text-white ml-0.5">
        <path d="M8 5v14l11-7z" />
      </svg>
    </div>
  )
}

// ── FeaturedVideo ─────────────────────────────────────────────────────────────

function FeaturedVideo({ item }: { item: VideoItem }) {
  const [playing, setPlaying] = useState(false)

  return (
    <div className="group">
      <div
        className="relative w-full aspect-video overflow-hidden bg-dark-200 cursor-pointer"
        onClick={() => setPlaying(true)}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPlaying(true) } }}
        role="button"
        tabIndex={0}
        aria-label={`Video abspielen: ${item.title}`}
      >
        {playing ? (
          <iframe
            src={getEmbedUrl(item.videoUrl)}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; fullscreen"
            allowFullScreen
            title={item.title}
          />
        ) : (
          <>
            <Image
              src={item.thumbSrc}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 90vw"
              priority
            />
            <div className="absolute inset-0 bg-black/35 group-hover:bg-black/20 transition-colors duration-300" />
            {item.category && (
              <span className="absolute top-4 left-4 text-[10px] tracking-[0.25em] uppercase text-white/50 font-sans">
                {item.category}
              </span>
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <PlayIcon size={72} />
            </div>
          </>
        )}
      </div>
      <div className="mt-5 px-1">
        <h3 className="font-serif text-2xl font-light text-light mb-2">{item.title}</h3>
        {item.description && (
          <p className="text-light-dim text-sm font-sans leading-relaxed">{item.description}</p>
        )}
      </div>
    </div>
  )
}

// ── CarouselCard ──────────────────────────────────────────────────────────────

function CarouselCard({ item }: { item: VideoItem }) {
  const [playing, setPlaying] = useState(false)

  return (
    <div className="group" onClick={() => !playing && setPlaying(true)}>
      <div
        className="relative w-full aspect-video overflow-hidden bg-dark-200 cursor-pointer"
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPlaying(true) } }}
        role="button"
        tabIndex={0}
        aria-label={`Video abspielen: ${item.title}`}
      >
        {playing ? (
          <iframe
            src={getEmbedUrl(item.videoUrl)}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; fullscreen"
            allowFullScreen
            title={item.title}
          />
        ) : (
          <>
            <Image
              src={item.thumbSrc}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors duration-300" />
            {item.category && (
              <span className="absolute top-3 left-3 text-[9px] tracking-[0.22em] uppercase text-white/45 font-sans">
                {item.category}
              </span>
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <PlayIcon size={44} />
            </div>
          </>
        )}
      </div>
      <div className="mt-3 px-0.5">
        <h4 className="font-serif text-base font-light text-light/90 truncate">{item.title}</h4>
      </div>
    </div>
  )
}

// ── VideoCarousel ─────────────────────────────────────────────────────────────

const GAP = 16

function VideoCarousel({ items }: { items: VideoItem[] }) {
  const trackRef    = useRef<HTMLDivElement>(null)
  const [canPrev,   setCanPrev]   = useState(false)
  const [canNext,   setCanNext]   = useState(items.length > 1)
  const [activeDot, setActiveDot] = useState(0)
  const [cardW,     setCardW]     = useState(0)

  useEffect(() => {
    const compute = () => {
      const track = trackRef.current
      if (!track) return
      const containerW = track.clientWidth
      const w = window.innerWidth
      const cpv = w < 640 ? 1.2 : w < 1024 ? 2 : 3
      setCardW((containerW - GAP * (Math.floor(cpv) - 1)) / cpv)
    }
    compute()
    window.addEventListener('resize', compute)
    return () => window.removeEventListener('resize', compute)
  }, [])

  const updateState = useCallback(() => {
    const t = trackRef.current
    if (!t || cardW === 0) return
    setCanPrev(t.scrollLeft > 8)
    setCanNext(t.scrollLeft < t.scrollWidth - t.clientWidth - 8)
    setActiveDot(Math.round(t.scrollLeft / (cardW + GAP)))
  }, [cardW])

  const scrollDir = useCallback((dir: 1 | -1) => {
    const t = trackRef.current
    if (!t || cardW === 0) return
    t.scrollBy({ left: dir * (cardW + GAP), behavior: 'smooth' })
  }, [cardW])

  const ArrowBtn = ({ dir }: { dir: 1 | -1 }) => (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={() => scrollDir(dir)}
      className={`absolute ${dir === -1 ? '-left-4 md:-left-5' : '-right-4 md:-right-5'} top-[40%] -translate-y-1/2 z-10
                  w-8 h-8 flex items-center justify-center rounded-full
                  bg-dark border border-white/10 text-white/35
                  hover:text-white/80 hover:border-white/25 hover:bg-dark-100
                  transition-colors duration-200`}
      aria-label={dir === -1 ? 'Vorheriges Video' : 'Nächstes Video'}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        {dir === -1
          ? <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          : <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        }
      </svg>
    </motion.button>
  )

  return (
    <div className="mt-14">
      <p className="text-white/20 text-[11px] tracking-[0.3em] uppercase font-sans mb-6 select-none">
        Weitere Projekte
      </p>

      <div className="relative">
        <AnimatePresence>{canPrev && <ArrowBtn dir={-1} />}</AnimatePresence>

        <div
          ref={trackRef}
          onScroll={updateState}
          className="flex overflow-x-scroll [&::-webkit-scrollbar]:hidden"
          style={{ gap: GAP, scrollbarWidth: 'none', scrollSnapType: 'x mandatory' }}
        >
          {items.map(item => (
            <div
              key={item.id}
              style={{
                flex: `0 0 ${cardW > 0 ? cardW + 'px' : 'calc(33.333% - 11px)'}`,
                scrollSnapAlign: 'start',
              }}
            >
              <CarouselCard item={item} />
            </div>
          ))}
        </div>

        <AnimatePresence>{canNext && <ArrowBtn dir={1} />}</AnimatePresence>
      </div>

      {/* Dots */}
      {items.length > 1 && (
        <div className="flex justify-center items-center gap-1.5 mt-5">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                const t = trackRef.current
                if (!t || cardW === 0) return
                t.scrollTo({ left: i * (cardW + GAP), behavior: 'smooth' })
              }}
              className={`rounded-full transition-all duration-300 ${
                i === activeDot
                  ? 'w-4 h-1.5 bg-white/50'
                  : 'w-1.5 h-1.5 bg-white/15 hover:bg-white/35'
              }`}
              aria-label={`Video ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Videography ───────────────────────────────────────────────────────────────

export default function Videography({ videos }: { videos: VideoProject[] }) {
  const items    = normalize(videos)
  // Always use items[0] as the hero — the query is sorted by `order asc` in Sanity,
  // so the lowest-order video is already first. Don't re-sort by `featured` flag here.
  const featured = items[0] ?? null
  const rest     = featured ? items.slice(1) : []

  return (
    <section id="videografie" className="py-24 md:py-32 bg-dark-100">
      <div className="px-6 md:px-10 max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="section-heading">Videografie</h2>
            <p className="section-subheading">Film & Motion</p>
          </div>
        </ScrollReveal>

        {featured && (
          <ScrollReveal>
            <FeaturedVideo item={featured} />
          </ScrollReveal>
        )}

        {rest.length > 0 && <VideoCarousel items={rest} />}
      </div>
    </section>
  )
}
