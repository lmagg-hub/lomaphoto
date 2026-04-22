import type { Metadata } from 'next'
import {
  Playfair_Display,
  Inter,
  Roboto,
  Open_Sans,
  Montserrat,
  Oswald,
  Cormorant_Garamond,
} from 'next/font/google'
import './globals.css'
import Analytics from '@/components/Analytics'
import CookieBanner from '@/components/CookieBanner'
import SiteWrapper from '@/components/SiteWrapper'

const playfair = Playfair_Display({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const roboto = Roboto({
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
  weight: ['400', '700'],
})

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
})

const oswald = Oswald({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-oswald',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-cormorant',
  display: 'swap',
  weight: ['300', '400', '500'],
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lomaphoto.at'
const OG_IMAGE = `${SITE_URL}/og-image.jpg`

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: 'Lorenz Magg | Photography & Videography',
    template: '%s | lomaphoto',
  },
  description:
    'Freelance photographer and videographer specializing in landscape, travel and portrait photography. Based worldwide.',
  keywords: [
    'photography',
    'videography',
    'landscape photography',
    'travel photography',
    'portrait photography',
    'Lorenz Magg',
    'lomaphoto',
    'Kunstdruck',
    'fine art print',
    'Fotograf',
    'Videograf',
  ],
  authors: [{ name: 'Lorenz Magg', url: SITE_URL }],
  creator: 'Lorenz Magg',
  publisher: 'lomaphoto',

  // Canonical
  alternates: {
    canonical: SITE_URL,
  },

  // Open Graph
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'lomaphoto',
    title: 'Lorenz Magg | Photography & Videography',
    description:
      'Freelance photographer and videographer specializing in landscape, travel and portrait photography. Based worldwide.',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Lorenz Magg — lomaphoto Photography & Videography',
      },
    ],
    locale: 'de_AT',
  },

  // Twitter / X
  twitter: {
    card: 'summary_large_image',
    title: 'Lorenz Magg | Photography & Videography',
    description:
      'Freelance photographer and videographer specializing in landscape, travel and portrait photography.',
    images: [OG_IMAGE],
    creator: '@lomaphoto',
    site: '@lomaphoto',
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // App / browser
  applicationName: 'lomaphoto',
  referrer: 'origin-when-cross-origin',
  formatDetection: { telephone: false },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${playfair.variable} ${inter.variable} ${roboto.variable} ${openSans.variable} ${montserrat.variable} ${oswald.variable} ${cormorant.variable}`}>
      <body className="bg-dark text-light font-sans antialiased">
        <SiteWrapper>
          {children}
        </SiteWrapper>
        <Analytics />
        <CookieBanner />
      </body>
    </html>
  )
}
