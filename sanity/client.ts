import { createClient } from '@sanity/client'

const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
}

// Read-only client — uses CDN for fast public data fetching
export const client = createClient({
  ...config,
  useCdn: true,
})

// Authenticated write client — bypasses CDN, uses API token
export const writeClient = createClient({
  ...config,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})
