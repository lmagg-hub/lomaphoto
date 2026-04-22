import { writeClient } from '@/sanity/client'
import { galleryQuery, settingsQuery } from '@/lib/queries'
import type { GalleryImage, SiteSettings } from '@/types'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ScatteredGallery from '@/components/ScatteredGallery'

export const metadata = {
  title: 'Galerie | lomaphoto',
  description: 'Alle Fotografien von Lorenz Magg — Portrait, Landschaft, Event und Commercial.',
}

const REVALIDATE = 10

async function fetchData() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  if (!projectId || projectId === 'placeholder') {
    return { images: [] as GalleryImage[], settings: null }
  }
  try {
    const fetchOpts = { next: { revalidate: REVALIDATE } }
    const [images, settings] = await Promise.all([
      writeClient.fetch<GalleryImage[]>(galleryQuery, {}, fetchOpts),
      writeClient.fetch<SiteSettings>(settingsQuery, {}, fetchOpts),
    ])
    return { images: images ?? [], settings: settings ?? null }
  } catch {
    return { images: [] as GalleryImage[], settings: null }
  }
}

export default async function GaleriePage() {
  const { images, settings } = await fetchData()

  return (
    <>
      <main className="overflow-x-hidden min-h-screen" style={{ background: 'var(--bg-primary)' }}>
        <Navigation settings={settings} />
        <div className="pt-24">
          <div className="text-center py-16 px-6">
            <h1 className="section-heading">Galerie</h1>
            <p className="section-subheading">Alle Arbeiten</p>
          </div>
          <ScatteredGallery images={images} />
        </div>
        <Footer settings={settings} />
      </main>
    </>
  )
}
