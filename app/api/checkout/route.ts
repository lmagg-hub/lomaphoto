import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { writeClient } from '@/sanity/client'
import { shopProductBySlugQuery } from '@/lib/queries'
import type { ShopProduct } from '@/types'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lomaphoto.at'

// In-memory rate limiter: 10 requests per 15 minutes per IP
const rateMap = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + 15 * 60_000 })
    return false
  }
  if (entry.count >= 10) return true
  entry.count++
  return false
}

// Periodically prune stale entries so the map doesn't grow forever
setInterval(() => {
  const now = Date.now()
  Array.from(rateMap.entries()).forEach(([key, val]) => {
    if (now > val.resetAt) rateMap.delete(key)
  })
}, 5 * 60_000)

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Stripe ist nicht konfiguriert.' }, { status: 503 })
  }

  // Rate limit by IP
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Zu viele Anfragen. Bitte versuche es in 15 Minuten erneut.' },
      { status: 429 }
    )
  }

  try {
    const { slug, size } = await req.json()

    if (!slug || !size) {
      return NextResponse.json({ error: 'Fehlende Parameter.' }, { status: 400 })
    }

    // Fetch authoritative product data from Sanity — never trust client-provided price
    const product: ShopProduct | null = await writeClient.fetch(shopProductBySlugQuery, { slug })

    if (!product || product.available === false) {
      return NextResponse.json({ error: 'Produkt nicht gefunden.' }, { status: 404 })
    }

    const sizeEntry = product.sizes?.find((s) => s.size === size)
    if (!sizeEntry) {
      return NextResponse.json({ error: 'Ungültige Größe.' }, { status: 400 })
    }

    const unitAmount = Math.round(sizeEntry.price * 100)
    if (unitAmount <= 0) {
      return NextResponse.json({ error: 'Ungültiger Preis.' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `${product.title} — ${size}`,
              description: 'Fine Art Print · Aludibond in Schattenfugenrahmen aus Holz',
              images: [],
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${SITE_URL}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/shop/${slug}`,
      shipping_address_collection: {
        allowed_countries: ['AT', 'DE', 'CH', 'IT', 'FR', 'NL', 'BE', 'LU'],
      },
      metadata: {
        productTitle: product.title,
        size,
        slug,
        price: String(sizeEntry.price),
      },
      locale: 'de',
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[Checkout] Error:', err)
    return NextResponse.json(
      { error: 'Fehler beim Erstellen der Checkout-Session.' },
      { status: 500 }
    )
  }
}
