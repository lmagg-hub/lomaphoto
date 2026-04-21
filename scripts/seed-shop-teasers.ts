/**
 * Run with:  npm run seed:teasers
 * Seeds 3 placeholder shopTeaser documents (no images — upload via Studio).
 */
import 'dotenv/config'
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  token:     process.env.SANITY_API_TOKEN!,
  useCdn:    false,
})

const placeholders = [
  { title: 'Fine Art Print 1', order: 1 },
  { title: 'Fine Art Print 2', order: 2 },
  { title: 'Fine Art Print 3', order: 3 },
]

async function seed() {
  console.log('Seeding 3 shopTeaser placeholders…')
  const tx = client.transaction()
  for (const p of placeholders) {
    tx.create({ _type: 'shopTeaser', ...p })
  }
  await tx.commit()
  console.log('Done. Open /studio → Shop Teaser Bilder to upload images.')
}

seed().catch((err) => { console.error(err); process.exit(1) })
