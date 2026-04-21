'use client'

import { useState } from 'react'
import type { ShopProductSize } from '@/types'

interface Props {
  slug: string
  sizes: ShopProductSize[]
}

export default function SizeSelector({ slug, sizes }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const selected = sizes[selectedIndex]

  const handleCheckout = async () => {
    if (!selected) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          size: selected.size,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Fehler beim Checkout')
      }

      const { url } = await res.json()
      window.location.href = url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler')
      setLoading(false)
    }
  }

  if (!sizes || sizes.length === 0) {
    return (
      <p className="text-light-dim text-sm font-sans">
        Keine Größen verfügbar.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Size options */}
      <div>
        <p className="text-[10px] tracking-widest uppercase text-light-dim font-sans mb-3">
          Größe wählen
        </p>
        <div className="flex flex-wrap gap-3">
          {sizes.map((s, i) => (
            <button
              key={s.size}
              onClick={() => setSelectedIndex(i)}
              className={`px-5 py-3 text-xs tracking-widest uppercase font-sans border transition-all duration-300 ${
                i === selectedIndex
                  ? 'border-gold text-gold bg-gold/5'
                  : 'border-dark-300 text-light-muted hover:border-light-muted hover:text-light'
              }`}
            >
              {s.size}
            </button>
          ))}
        </div>
      </div>

      {/* Material */}
      <div>
        <p className="text-[10px] tracking-widest uppercase text-light-dim font-sans mb-1">
          Material
        </p>
        <p className="text-light-muted font-sans text-sm">
          Aludibond in Schattenfugenrahmen aus Holz
        </p>
      </div>

      {/* Price */}
      <div className="pt-2 border-t border-dark-200">
        <p className="text-[10px] tracking-widest uppercase text-light-dim font-sans mb-1">
          Preis
        </p>
        <p className="font-serif text-3xl font-light text-gold">
          € {selected?.price}
        </p>
        <p className="text-[10px] text-light-dim font-sans mt-1">inkl. MwSt. · Versand zzgl.</p>
      </div>

      {/* Error */}
      {error && <p className="text-red-400 text-xs font-sans">{error}</p>}

      {/* Buy button */}
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full py-4 text-sm tracking-widest uppercase border border-gold text-gold hover:bg-gold hover:text-dark transition-all duration-300 font-sans disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Weiterleitung zu Stripe …' : 'Jetzt kaufen'}
      </button>

      <p className="text-[10px] text-light-dim font-sans text-center">
        Sichere Zahlung über Stripe · Kreditkarte, SEPA, Klarna
      </p>
    </div>
  )
}
