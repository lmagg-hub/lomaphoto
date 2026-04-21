'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import type { VideoProject } from '@/types'
import { urlFor } from '@/sanity/image'
import ScrollReveal from './ScrollReveal'

const DEMO_VIDEOS: Array<Partial<VideoProject> & { id: string; thumbSrc: string }> = [
  {
    id: 'd1',
    title: 'Showreel 2024',
    description: 'Ein Querschnitt meiner besten Arbeiten aus dem vergangenen Jahr.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    category: 'showreel',
    featured: true,
    thumbSrc: 'https://picsum.photos/seed/vid1/1200/680',
  },
  {
    id: 'd2',
    title: 'Wedding Film — M & S',
    description: 'Ein emotionaler Hochzeitsfilm im alpinen Ambiente.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    category: 'wedding',
    featured: false,
    thumbSrc: 'https://picsum.photos/seed/vid2/800/500',
  },
  {
    id: 'd3',
    title: 'Commercial — Brand X',
    description: 'Produktfilm mit kinematografischer Bildsprache.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    category: 'commercial',
    featured: false,
    thumbSrc: 'https://picsum.photos/seed/vid3/800/500',
  },
]

function getEmbedUrl(url: string): string {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=1&rel=0`

  const vimeo = url.match(/vimeo\.com\/(\d+)/)
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1`

  return url
}

interface VideoCardProps {
  title: string
  description?: string
  thumbSrc: string
  videoUrl: string
  featured?: boolean
  category?: string
}

function VideoCard({ title, description, thumbSrc, videoUrl, featured, category }: VideoCardProps) {
  const [playing, setPlaying] = useState(false)
  const embedUrl = getEmbedUrl(videoUrl)

  return (
    <div className={`group ${featured ? 'col-span-full' : ''}`}>
      <div
        className={`relative overflow-hidden bg-dark-200 cursor-pointer ${
          featured ? 'aspect-video' : 'aspect-video'
        }`}
        onClick={() => setPlaying(true)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPlaying(true) } }}
        role="button"
        tabIndex={0}
        aria-label={`Video abspielen: ${title}`}
      >
        {playing ? (
          <iframe
            src={embedUrl}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; fullscreen"
            allowFullScreen
            title={title}
          />
        ) : (
          <>
            <Image
              src={thumbSrc}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes={featured ? '100vw' : '(max-width: 768px) 100vw, 50vw'}
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border border-light/50 flex items-center justify-center bg-black/30 backdrop-blur-sm group-hover:border-gold group-hover:bg-black/50 transition-all duration-300">
                <svg className="w-6 h-6 text-light ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            {category && (
              <span className="absolute top-4 left-4 text-[10px] tracking-[0.25em] uppercase text-light-muted font-sans">
                {category}
              </span>
            )}
          </>
        )}
      </div>
      <div className="mt-4 px-1">
        <h3 className="font-serif text-xl font-light text-light mb-1">{title}</h3>
        {description && <p className="text-light-dim text-sm font-sans">{description}</p>}
      </div>
    </div>
  )
}

export default function Videography({ videos }: { videos: VideoProject[] }) {
  const items = videos.length > 0 ? videos : DEMO_VIDEOS

  return (
    <section id="videografie" className="py-24 md:py-32 bg-dark-100">
      <div className="px-6 md:px-10 max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="section-heading">Videografie</h2>
            <p className="section-subheading">Film & Motion</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
          {items.map((item, idx) => {
            const isSanity = '_id' in item
            const thumbSrc = isSanity && (item as VideoProject).thumbnail
              ? urlFor((item as VideoProject).thumbnail!).width(1200).url()
              : (item as typeof DEMO_VIDEOS[0]).thumbSrc

            return (
              <motion.div
                key={isSanity ? (item as VideoProject)._id : (item as typeof DEMO_VIDEOS[0]).id}
                initial={{ opacity: 0, x: -38 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 1.0, delay: idx * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
                className={(item as VideoProject).featured ? 'md:col-span-2' : ''}
              >
                <VideoCard
                  title={item.title ?? ''}
                  description={item.description}
                  thumbSrc={thumbSrc}
                  videoUrl={item.videoUrl ?? ''}
                  featured={(item as VideoProject).featured}
                  category={item.category}
                />
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
