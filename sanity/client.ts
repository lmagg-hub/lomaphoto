import { createClient } from '@sanity/client'

const projectId  = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID  || 'placeholder'
const dataset    = process.env.NEXT_PUBLIC_SANITY_DATASET      || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION  || '2024-01-01'

const baseConfig = { projectId, dataset, apiVersion }

// Read-only client — CDN, no auth required
export const client = createClient({ ...baseConfig, useCdn: true })

/**
 * Strip every character outside printable ASCII (0x21–0x7E).
 * Catches newlines, carriage returns, zero-width spaces, and other
 * invisible characters that can slip in when pasting into Vercel's
 * env-var UI and corrupt the Authorization header value.
 */
function sanitizeToken(raw: string | undefined): string | undefined {
  if (!raw) return undefined
  const clean = raw.replace(/[^\x21-\x7E]/g, '')
  return clean || undefined
}

const token = sanitizeToken(process.env.SANITY_API_TOKEN)

// Authenticated client — bypasses CDN so mutations and drafts are visible.
// The sanitized token guarantees  "Authorization: Bearer <token>"  is a
// valid header value on every platform including Vercel edge workers.
export const writeClient = createClient({
  ...baseConfig,
  useCdn: false,
  token,
})
