import { galleryImageSchema } from './galleryImage'
import { videoProjectSchema } from './videoProject'
import { productSchema } from './product'
import { aboutSchema } from './about'
import { siteSettingsSchema } from './siteSettings'
import { shopProductSchema } from './shopProduct'
import { clientTickerSchema } from './clientTicker'
import { shopTeaserSchema } from './shopTeaser'
import { heroVideosSchema } from './heroVideos'

export const schemaTypes = [
  siteSettingsSchema,
  heroVideosSchema,
  aboutSchema,
  galleryImageSchema,
  videoProjectSchema,
  productSchema,
  shopProductSchema,
  clientTickerSchema,
  shopTeaserSchema,
]
