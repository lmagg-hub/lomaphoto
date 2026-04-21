import { galleryImageSchema } from './galleryImage'
import { videoProjectSchema } from './videoProject'
import { productSchema } from './product'
import { aboutSchema } from './about'
import { siteSettingsSchema } from './siteSettings'
import { shopProductSchema } from './shopProduct'
import { clientTickerSchema } from './clientTicker'
import { shopTeaserSchema } from './shopTeaser'

export const schemaTypes = [
  siteSettingsSchema,
  aboutSchema,
  galleryImageSchema,
  videoProjectSchema,
  productSchema,
  shopProductSchema,
  clientTickerSchema,
  shopTeaserSchema,
]
