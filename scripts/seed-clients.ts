/**
 * Run with:  npx tsx scripts/seed-clients.ts
 *
 * Requires NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET,
 * and SANITY_API_TOKEN to be set in .env.local
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

const clients = [
  { companyName: 'EQUANS',                                         fontStyle: 'Roboto',             order: 1 },
  { companyName: 'SCHÖNHERR',                                      fontStyle: 'Playfair Display',   order: 2 },
  { companyName: 'SIEMENS',                                        fontStyle: 'Arial',              order: 3 },
  { companyName: 'JANSSEN',                                        fontStyle: 'Open Sans',          order: 4 },
  { companyName: 'KOURAGE FILM',                                   fontStyle: 'Montserrat',         order: 5 },
  { companyName: 'WBV WIENER BASKETBALLVERBAND',                   fontStyle: 'Oswald',             order: 6 },
  { companyName: 'KANADISCHE BOTSCHAFT',                           fontStyle: 'Cormorant Garamond', order: 7 },
  { companyName: 'NBBV NIEDERÖSTERREICHISCHER BASKETBALLVERBAND',  fontStyle: 'Oswald',             order: 8 },
]

async function seed() {
  console.log(`Seeding ${clients.length} clients to Sanity…`)

  const transaction = client.transaction()
  for (const c of clients) {
    transaction.create({ _type: 'clientTicker', ...c, active: true })
  }

  await transaction.commit()
  console.log('Done.')
}

seed().catch((err) => { console.error(err); process.exit(1) })
