import type { Metadata } from 'next'
import { writeClient } from '@/sanity/client'
import { shopProductsQuery } from '@/lib/queries'
import type { ShopProduct } from '@/types'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import VideoHeader from '@/components/shop/VideoHeader'
import ProductCard from '@/components/shop/ProductCard'

export const revalidate = 30

export const metadata: Metadata = {
  title: 'Shop — Fine Art Prints',
  description:
    'Limitierte Fine Art Prints von lomaphoto. Aludibond-Drucke in handgefertigten Schattenfugenrahmen aus Holz.',
}

async function fetchProducts(): Promise<ShopProduct[]> {
  try {
    const products = await writeClient.fetch<ShopProduct[]>(
      shopProductsQuery,
      {},
      { next: { revalidate: 30 } }
    )
    return products ?? []
  } catch (err) {
    console.error('[Shop] Fetch error:', err)
    return []
  }
}

export default async function ShopPage() {
  const products = await fetchProducts()

  return (
    <main className="min-h-screen bg-dark overflow-x-hidden">
      <Navigation settings={null} />

      {/* Visually-hidden h1 always present for SEO; visible h1 is inside VideoHeader client component */}
      <h1 className="sr-only">Fine Art Prints — lomaphoto</h1>

      {/* Video header — top 50vh */}
      <VideoHeader />

      {/* Smooth scroll anchor */}
      <div id="prints" />

      {/* Product grid */}
      <section className="py-20 md:py-28 px-6 md:px-10 max-w-6xl mx-auto">
        {products.length > 0 ? (
          <>
            <div className="text-center mb-16">
              <p className="text-[10px] tracking-[0.4em] uppercase text-light-dim font-sans mb-4">
                Kollektion
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-light text-light tracking-wider">
                Alle Prints
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-24">
            <p className="font-serif text-3xl font-light text-light mb-4">
              Coming soon.
            </p>
            <p className="text-light-muted text-sm font-sans tracking-wide">
              Die erste Kollektion erscheint in Kürze.
            </p>
          </div>
        )}
      </section>

      <Footer settings={null} />
    </main>
  )
}
