import type { SiteSettings, GalleryImage } from '@/types'
import { urlFor } from '@/sanity/image'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lomaphoto.at'

interface Props {
  settings: SiteSettings | null
  gallery: GalleryImage[]
}

export default function StructuredData({ settings, gallery }: Props) {
  const instagramUrl = settings?.instagramUrl ?? 'https://instagram.com/lomaphoto'
  const email = settings?.email ?? 'hello@lomaphoto.at'
  const youtubeUrl = settings?.youtubeUrl

  const sameAs = [instagramUrl, youtubeUrl].filter(Boolean)

  // Person / Photographer schema
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: 'Lorenz Magg',
    url: SITE_URL,
    email,
    jobTitle: 'Photographer & Videographer',
    description:
      'Freelance photographer and videographer specializing in landscape, travel and portrait photography.',
    image: `${SITE_URL}/og-image.jpg`,
    sameAs,
    knowsAbout: ['Photography', 'Videography', 'Landscape Photography', 'Portrait Photography', 'Fine Art Print'],
  }

  // WebSite schema
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: 'lomaphoto',
    url: SITE_URL,
    author: { '@id': `${SITE_URL}/#person` },
    description: 'Photography & Videography portfolio of Lorenz Magg',
    inLanguage: 'de',
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/?s={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  }

  // ImageGallery schema (only if we have real Sanity images)
  const galleryImages = gallery
    .filter((img) => img.image?.asset)
    .slice(0, 10)
    .map((img) => ({
      '@type': 'ImageObject',
      name: img.title,
      description: img.alt,
      contentUrl: urlFor(img.image).width(1200).url(),
      author: { '@id': `${SITE_URL}/#person` },
    }))

  const gallerySchema =
    galleryImages.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'ImageGallery',
          name: 'Photography Portfolio — Lorenz Magg',
          url: `${SITE_URL}/#galerie`,
          author: { '@id': `${SITE_URL}/#person` },
          image: galleryImages,
        }
      : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {gallerySchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(gallerySchema) }}
        />
      )}
    </>
  )
}
