import { writeClient } from '@/sanity/client'
import {
  featuredGalleryQuery,
  videosQuery,
  shopTeaserQuery,
  aboutQuery,
  settingsQuery,
  heroVideosQuery,
} from '@/lib/queries'
import type { GalleryImage, VideoProject, ShopTeaser, About, SiteSettings, HeroVideos } from '@/types'
import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import Gallery from '@/components/Gallery'
import Videography from '@/components/Videography'
import Shop from '@/components/Shop'
import AboutSection from '@/components/About'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import StructuredData from '@/components/StructuredData'
import ClientTicker from '@/components/ClientTicker'
import ScrollToHash from '@/components/ScrollToHash'

const REVALIDATE = 10

async function fetchSanityData() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  if (!projectId || projectId === 'placeholder') {
    console.warn('[Sanity] NEXT_PUBLIC_SANITY_PROJECT_ID not set — using demo data')
    return { gallery: [], videos: [], teasers: [], about: null, settings: null }
  }

  const fetchOpts = { next: { revalidate: REVALIDATE } }

  try {
    const [gallery, videos, teasers, about, settings, heroVideos] = await Promise.all([
      writeClient.fetch<GalleryImage[]>(featuredGalleryQuery, {}, fetchOpts),
      writeClient.fetch<VideoProject[]>(videosQuery, {}, fetchOpts),
      writeClient.fetch<ShopTeaser[]>(shopTeaserQuery, {}, { next: { revalidate: 30 } }),
      writeClient.fetch<About>(aboutQuery, {}, fetchOpts),
      writeClient.fetch<SiteSettings>(settingsQuery, {}, fetchOpts),
      writeClient.fetch<HeroVideos | null>(heroVideosQuery, {}, fetchOpts),
    ])

    const heroVideoUrls = (heroVideos?.videos ?? [])
      .map(v => v.video?.asset?.url)
      .filter((u): u is string => Boolean(u))

    return {
      gallery: gallery ?? [],
      videos: videos ?? [],
      teasers: teasers ?? [],
      about,
      settings,
      heroVideoUrls,
    }
  } catch (err) {
    console.error('[Sanity] Fetch error:', err)
    return { gallery: [], videos: [], teasers: [], about: null, settings: null, heroVideoUrls: [] }
  }
}

export default async function Home() {
  const { gallery, videos, teasers, about, settings, heroVideoUrls } = await fetchSanityData()

  return (
    <>
      <StructuredData settings={settings} gallery={gallery} />
      <main className="overflow-x-hidden">
        <ScrollToHash />
        <Navigation settings={settings} />
        <Hero settings={settings} heroVideoUrls={heroVideoUrls} />
        <Gallery images={gallery} />
        <Videography videos={videos} />
        <ClientTicker />
        <Shop teasers={teasers} />
        <AboutSection about={about} />
        <Contact settings={settings} />
        <Footer settings={settings} />
      </main>
    </>
  )
}
