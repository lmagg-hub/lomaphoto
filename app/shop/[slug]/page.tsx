import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { writeClient } from '@/sanity/client'
import { shopProductBySlugQuery, shopProductsQuery } from '@/lib/queries'
import type { ShopProduct } from '@/types'
import { urlFor } from '@/sanity/image'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import SizeSelector from '@/components/shop/SizeSelector'

export const revalidate = 30

// Pre-generate routes for all products
export async function generateStaticParams() {
  try {
    const products = await writeClient.fetch<ShopProduct[]>(shopProductsQuery)
    return (products ?? []).map((p) => ({ slug: p.slug.current }))
  } catch {
    return []
  }
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lomaphoto.at'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = await writeClient
    .fetch<ShopProduct>(shopProductBySlugQuery, { slug })
    .catch(() => null)

  if (!product) return { title: 'Print nicht gefunden' }

  const imgUrl = product.mainImage?.asset
    ? urlFor(product.mainImage).width(1200).url()
    : undefined

  const prices = (product.sizes ?? []).map((s) => s.price).filter(Boolean)
  const minPrice = prices.length ? Math.min(...prices) : null
  const canonicalUrl = `${SITE_URL}/shop/${slug}`

  const description = `${product.title} — Fine Art Print auf Aludibond im handgefertigten Schattenfugenrahmen aus Holz.${minPrice ? ` Ab € ${minPrice}.` : ''} Kostenloser Versand in der EU.`

  return {
    title: `${product.title} | Fine Art Print | lomaphoto`,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${product.title} | Fine Art Print`,
      description,
      url: canonicalUrl,
      type: 'website',
      images: imgUrl ? [{ url: imgUrl, width: 1200, height: 900, alt: product.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.title} | Fine Art Print`,
      description,
      images: imgUrl ? [imgUrl] : [],
    },
  }
}

const portableComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="text-light-muted font-sans text-base leading-relaxed mb-4">{children}</p>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-semibold text-light">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="italic">{children}</em>
    ),
  },
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await writeClient
    .fetch<ShopProduct>(shopProductBySlugQuery, { slug }, { next: { revalidate: 30 } })
    .catch(() => null)

  if (!product) notFound()

  const heroSrc = product.mainImage?.asset
    ? urlFor(product.mainImage).width(1600).url()
    : 'https://picsum.photos/seed/product-hero/1600/900'

  const prices = (product.sizes ?? []).map((s) => s.price).filter(Boolean)
  const canonicalUrl = `${SITE_URL}/shop/${slug}`
  const imgUrl = product.mainImage?.asset ? urlFor(product.mainImage).width(1200).url() : undefined

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: `Fine Art Print auf Aludibond im handgefertigten Schattenfugenrahmen aus Holz.`,
    url: canonicalUrl,
    ...(imgUrl ? { image: imgUrl } : {}),
    brand: { '@type': 'Brand', name: 'lomaphoto' },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'EUR',
      lowPrice: prices.length ? Math.min(...prices) : undefined,
      highPrice: prices.length ? Math.max(...prices) : undefined,
      offerCount: prices.length,
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Person', name: 'Lorenz Magg' },
    },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Shop', item: `${SITE_URL}/shop` },
      { '@type': 'ListItem', position: 3, name: product.title, item: canonicalUrl },
    ],
  }

  return (
    <main className="min-h-screen bg-dark overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Navigation settings={null} />

      {/* ── Hero image ── */}
      <div className="relative w-full" style={{ height: '65vh', marginTop: 0, paddingTop: '80px' }}>
        <Image
          src={heroSrc}
          alt={product.mainImage?.alt ?? product.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60" />
      </div>

      {/* ── Breadcrumb ── */}
      <div className="px-6 md:px-10 max-w-6xl mx-auto pt-8">
        <Link
          href="/shop"
          className="text-[10px] tracking-widest uppercase text-light-dim hover:text-light font-sans transition-colors duration-300"
        >
          ← Zurück zum Shop
        </Link>
      </div>

      {/* ── Product details ── */}
      <section className="px-6 md:px-10 max-w-6xl mx-auto py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">

          {/* Left: title + description */}
          <div>
            <p className="text-[10px] tracking-[0.4em] uppercase text-gold font-sans mb-4">
              Fine Art Print
            </p>
            <h1 className="font-serif text-4xl md:text-5xl font-light text-light tracking-wide mb-8 leading-tight">
              {product.title}
            </h1>

            {product.description && product.description.length > 0 && (
              <div className="border-t border-dark-200 pt-6">
                <PortableText
                  value={product.description}
                  components={portableComponents}
                />
              </div>
            )}

            {/* Details */}
            <div className="mt-8 pt-8 border-t border-dark-200 space-y-3">
              {[
                ['Material', 'Aludibond-Direktdruck'],
                ['Rahmen', 'Schattenfugenrahmen aus Holz, handgefertigt'],
                ['Oberfläche', 'Matt / Seidenmatt'],
                ['Aufhängung', 'Inklusive Aufhängung, sofort bereit'],
              ].map(([key, val]) => (
                <div key={key} className="flex gap-4 text-sm font-sans">
                  <span className="text-light-dim w-24 shrink-0">{key}</span>
                  <span className="text-light-muted">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: size selector */}
          <div className="md:pt-16">
            <SizeSelector
              slug={product.slug.current}
              sizes={product.sizes ?? []}
            />
          </div>
        </div>
      </section>

      {/* ── Mockup images ── */}
      {product.mockupImages && product.mockupImages.length > 0 && (
        <section className="px-6 md:px-10 max-w-6xl mx-auto pb-20 md:pb-28">
          <p className="text-[10px] tracking-widest uppercase text-light-dim font-sans mb-8">
            Impression
          </p>
          <div
            className="grid gap-5"
            style={{
              gridTemplateColumns: `repeat(${Math.min(product.mockupImages.length, 3)}, 1fr)`,
            }}
          >
            {product.mockupImages.map((img, idx) => {
              if (!img?.asset) return null
              return (
                <div key={idx} className="relative overflow-hidden bg-dark-200 aspect-[4/3]">
                  <Image
                    src={urlFor(img).width(900).url()}
                    alt={img.alt ?? `${product.title} Mockup ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              )
            })}
          </div>
        </section>
      )}

      <Footer settings={null} />
    </main>
  )
}
