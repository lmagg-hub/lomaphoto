import { writeClient } from '@/sanity/client'
import {
  featuredGalleryQuery,
  videosQuery,
  shopTeaserQuery,
  aboutQuery,
  settingsQuery,
  heroVideosQuery,
  homepageSettingsQuery,
} from '@/lib/queries'
import type {
  GalleryImage, VideoProject, ShopTeaser, About,
  SiteSettings, HeroVideos, HomepageSettings, HomepageSection, SectionKey,
} from '@/types'
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

// Default order when no homepage settings exist in Sanity
const DEFAULT_SECTIONS: HomepageSection[] = [
  { section: 'hero',        enabled: true },
  { section: 'gallery',     enabled: true },
  { section: 'videography', enabled: true },
  { section: 'clients',     enabled: true },
  { section: 'shop',        enabled: true },
  { section: 'about',       enabled: true },
  { section: 'contact',     enabled: true },
]

async function fetchSanityData() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  if (!projectId || projectId === 'placeholder') {
    console.warn('[Sanity] NEXT_PUBLIC_SANITY_PROJECT_ID not set — using demo data')
    return {
      gallery: [], videos: [], teasers: [], about: null,
      settings: null, heroVideoUrls: [], homepageSettings: null,
    }
  }

  const fetchOpts = { next: { revalidate: REVALIDATE } }

  try {
    const [gallery, videos, teasers, about, settings, heroVideos, homepageSettings] = await Promise.all([
      writeClient.fetch<GalleryImage[]>(featuredGalleryQuery, {}, fetchOpts),
      writeClient.fetch<VideoProject[]>(videosQuery, {}, fetchOpts),
      writeClient.fetch<ShopTeaser[]>(shopTeaserQuery, {}, { next: { revalidate: 30 } }),
      writeClient.fetch<About>(aboutQuery, {}, fetchOpts),
      writeClient.fetch<SiteSettings>(settingsQuery, {}, fetchOpts),
      writeClient.fetch<HeroVideos | null>(heroVideosQuery, {}, fetchOpts),
      writeClient.fetch<HomepageSettings | null>(homepageSettingsQuery, {}, fetchOpts),
    ])

    const heroVideoUrls = (heroVideos?.videos ?? [])
      .map(v => v.video?.asset?.url)
      .filter((u): u is string => Boolean(u))

    return {
      gallery:          gallery          ?? [],
      videos:           videos           ?? [],
      teasers:          teasers          ?? [],
      about,
      settings,
      heroVideoUrls,
      homepageSettings: homepageSettings ?? null,
    }
  } catch (err) {
    console.error('[Sanity] Fetch error:', err)
    return {
      gallery: [], videos: [], teasers: [], about: null,
      settings: null, heroVideoUrls: [], homepageSettings: null,
    }
  }
}

// ── Section renderer ───────────────────────────────────────────────────────────

interface SectionProps {
  section:     SectionKey
  gallery:     GalleryImage[]
  videos:      VideoProject[]
  teasers:     ShopTeaser[]
  about:       About | null
  settings:    SiteSettings | null
  heroVideoUrls: string[]
}

function renderSection({ section, gallery, videos, teasers, about, settings, heroVideoUrls }: SectionProps) {
  switch (section) {
    case 'hero':        return <Hero        key="hero"        settings={settings} heroVideoUrls={heroVideoUrls} />
    case 'gallery':     return <Gallery     key="gallery"     images={gallery} />
    case 'videography': return <Videography key="videography" videos={videos} />
    case 'clients':     return <ClientTicker key="clients" />
    case 'shop':        return <Shop        key="shop"        teasers={teasers} />
    case 'about':       return <AboutSection key="about"      about={about} />
    case 'contact':     return <Contact     key="contact"     settings={settings} />
    default:            return null
  }
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function Home() {
  const { gallery, videos, teasers, about, settings, heroVideoUrls, homepageSettings } = await fetchSanityData()

  // Use Sanity order if configured (and non-empty), otherwise fall back to defaults
  const sections = homepageSettings?.sectionOrder?.length
    ? homepageSettings.sectionOrder
    : DEFAULT_SECTIONS

  return (
    <>
      <StructuredData settings={settings} gallery={gallery} />
      <main className="overflow-x-hidden">
        <ScrollToHash />
        <Navigation settings={settings} />

        {sections
          .filter(({ enabled }) => enabled)
          .map(({ section }) =>
            renderSection({ section, gallery, videos, teasers, about, settings, heroVideoUrls })
          )
        }

        <Footer settings={settings} />
      </main>
    </>
  )
}
