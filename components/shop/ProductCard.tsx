import Image from 'next/image'
import Link from 'next/link'
import type { ShopProduct } from '@/types'
import { urlFor } from '@/sanity/image'

interface Props {
  product: ShopProduct
}

export default function ProductCard({ product }: Props) {
  const imgSrc = product.mainImage?.asset
    ? urlFor(product.mainImage).width(800).url()
    : 'https://picsum.photos/seed/shop-placeholder/800/1000'

  const lowestPrice = product.sizes?.length
    ? Math.min(...product.sizes.map((s) => s.price))
    : null

  return (
    <Link href={`/shop/${product.slug.current}`} className="group block">
      {/* Image */}
      <div className="relative overflow-hidden bg-dark-200 aspect-[4/5] mb-5">
        <Image
          src={imgSrc}
          alt={product.mainImage?.alt ?? product.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {!product.available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-[10px] tracking-widest uppercase text-light-muted border border-light-dim px-3 py-1.5 font-sans">
              Vergriffen
            </span>
          </div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 flex items-center justify-center">
          <span className="text-white text-xs tracking-widest uppercase font-sans opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-white/60 px-5 py-2.5">
            Details
          </span>
        </div>
      </div>

      {/* Info */}
      <div>
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-serif text-xl font-light text-light group-hover:text-gold transition-colors duration-300">
            {product.title}
          </h3>
          {lowestPrice && (
            <span className="text-light-muted font-sans text-sm ml-3 whitespace-nowrap">
              ab € {lowestPrice}
            </span>
          )}
        </div>
        <p className="text-[10px] tracking-widest uppercase text-light-dim font-sans">
          Aludibond · Schattenfugenrahmen
        </p>
      </div>
    </Link>
  )
}
