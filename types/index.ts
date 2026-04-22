export interface SanityImageAsset {
  _id: string
  url: string
  metadata?: {
    dimensions?: {
      width: number
      height: number
      aspectRatio: number
    }
    palette?: {
      dominant?: { background: string; foreground: string }
    }
    lqip?: string
  }
}

export interface SanityImage {
  asset: SanityImageAsset
  hotspot?: { x: number; y: number }
  crop?: { top: number; bottom: number; left: number; right: number }
}

export interface GalleryImage {
  _id: string
  title: string
  alt: string
  category: string
  order: number
  animated?: boolean
  featured?: boolean
  image: SanityImage
}

export interface VideoProject {
  _id: string
  title: string
  description: string
  videoUrl: string
  category: string
  featured: boolean
  thumbnail?: SanityImage
}

export interface Product {
  _id: string
  title: string
  description: string
  price: number
  buyLink: string
  available: boolean
  edition?: string
  order: number
  image: SanityImage
}

export interface About {
  bio: PortableTextBlock[]
  image?: SanityImage
  imageAlt?: string
}

export interface SiteSettings {
  heroTitle: string
  heroSubtitle: string
  email: string
  phone?: string
  instagramUrl?: string
  youtubeUrl?: string
  vimeoUrl?: string
  location?: string
}

export interface ShopProductSize {
  size: string   // '30 × 20 cm' | '60 × 40 cm'
  price: number
}

export interface ShopProduct {
  _id: string
  title: string
  slug: { current: string }
  mainImage: SanityImage & { alt?: string }
  mockupImages?: Array<SanityImage & { alt?: string }>
  description?: PortableTextBlock[]
  sizes: ShopProductSize[]
  available: boolean
  featured: boolean
}

export interface ShopTeaser {
  _id: string
  title: string
  order: number
  image?: SanityImage & { alt?: string }
}

export interface TickerClient {
  _id: string
  companyName: string
  fontStyle: string
  order: number
}

export type PortableTextBlock = {
  _type: 'block'
  _key: string
  style: string
  children: Array<{ _type: 'span'; _key: string; text: string; marks: string[] }>
  markDefs: unknown[]
}
