import { groq } from 'next-sanity'

const imageFields = `
  asset->{
    _id,
    url,
    metadata {
      dimensions { width, height, aspectRatio },
      lqip
    }
  },
  hotspot,
  crop
`

export const galleryQuery = groq`
  *[_type == "galleryImage"] | order(order asc, _createdAt desc) {
    _id,
    title,
    alt,
    category,
    order,
    animated,
    image { ${imageFields} }
  }
`

export const videosQuery = groq`
  *[_type == "videoProject"] | order(featured desc, _createdAt desc) {
    _id,
    title,
    description,
    videoUrl,
    category,
    featured,
    thumbnail { ${imageFields} }
  }
`

export const productsQuery = groq`
  *[_type == "product"] | order(order asc, _createdAt asc) {
    _id,
    title,
    description,
    price,
    buyLink,
    available,
    edition,
    order,
    image { ${imageFields} }
  }
`

export const aboutQuery = groq`
  *[_type == "about"][0] {
    bio,
    imageAlt,
    image { ${imageFields} }
  }
`

const shopImageFields = `
  asset->{
    _id,
    url,
    metadata { dimensions { width, height, aspectRatio } }
  },
  hotspot,
  crop,
  alt
`

export const shopProductsQuery = groq`
  *[_type == "shopProduct" && available != false] | order(_createdAt asc) {
    _id,
    title,
    slug,
    mainImage { ${shopImageFields} },
    description,
    sizes[] { size, price },
    available,
    featured
  }
`

export const featuredShopProductsQuery = groq`
  *[_type == "shopProduct" && featured == true && available != false] | order(_createdAt asc) [0...4] {
    _id,
    title,
    slug,
    mainImage { ${shopImageFields} },
    sizes[] { size, price },
    available,
    featured
  }
`

export const shopProductBySlugQuery = groq`
  *[_type == "shopProduct" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    mainImage { ${shopImageFields} },
    mockupImages[] { ${shopImageFields} },
    description,
    sizes[] { size, price },
    available,
    featured
  }
`

export const shopTeaserQuery = groq`
  *[_type == "shopTeaser"] | order(order asc) [0...3] {
    _id,
    title,
    order,
    image {
      asset->{ _id, url, metadata { dimensions { width, height } } },
      hotspot,
      crop,
      alt
    }
  }
`

export const clientTickerQuery = groq`
  *[_type == "clientTicker" && active != false] | order(order asc) {
    _id,
    companyName,
    fontStyle,
    order
  }
`

export const settingsQuery = groq`
  *[_type == "siteSettings"][0] {
    heroTitle,
    heroSubtitle,
    email,
    phone,
    instagramUrl,
    youtubeUrl,
    vimeoUrl,
    location
  }
`
