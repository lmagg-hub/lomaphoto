
const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'b38esbgq'
const isProd = process.env.NODE_ENV === 'production'

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://js.stripe.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  `img-src 'self' data: https://cdn.sanity.io https://${SANITY_PROJECT_ID}.api.sanity.io`,
  "media-src 'self' blob: data: https:",
  "frame-src https://js.stripe.com https://hooks.stripe.com",
  `connect-src 'self' https://${SANITY_PROJECT_ID}.api.sanity.io https://${SANITY_PROJECT_ID}.apicdn.sanity.io wss://${SANITY_PROJECT_ID}.api.sanity.io https://www.google-analytics.com https://region1.google-analytics.com https://api.stripe.com`,
].join('; ')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },

  async headers() {
    return [
      {
        // Sanity Studio — relaxed headers so the editor works
        source: '/studio/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      {
        source: '/((?!studio).*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          // HSTS only in production (HTTPS required)
          ...(isProd
            ? [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }]
            : []),
          // CSP only in production — dev mode uses eval() for webpack source maps
          ...(isProd
            ? [{ key: 'Content-Security-Policy', value: csp }]
            : []),
        ],
      },
    ]
  },
}

export default nextConfig
