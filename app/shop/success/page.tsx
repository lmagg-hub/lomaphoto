import Link from 'next/link'
import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Bestellung erfolgreich',
  robots: { index: false, follow: false },
}

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-dark overflow-x-hidden">
      <Navigation settings={null} />

      <div
        className="flex flex-col items-center justify-center text-center px-6"
        style={{ minHeight: '80vh' }}
      >
        {/* Icon */}
        <div className="w-16 h-16 border border-gold flex items-center justify-center mb-10">
          <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <p className="text-gold text-[10px] tracking-[0.4em] uppercase font-sans mb-4">
          Vielen Dank
        </p>
        <h1 className="font-serif text-4xl md:text-5xl font-light text-light tracking-wide mb-6">
          Bestellung erfolgreich.
        </h1>
        <p className="text-light-muted font-sans text-base max-w-md leading-relaxed mb-4">
          Wir werden uns in Kürze bei dir melden und dich über den Versand deines Prints informieren.
        </p>
        <p className="text-light-dim font-sans text-sm max-w-md leading-relaxed mb-12">
          Eine Bestätigung wurde an deine E-Mail-Adresse gesendet.
        </p>

        <Link
          href="/shop"
          className="inline-block px-10 py-4 text-xs tracking-widest uppercase border border-gold text-gold hover:bg-gold hover:text-dark transition-all duration-300 font-sans"
        >
          Zurück zum Shop
        </Link>
      </div>

      <Footer settings={null} />
    </main>
  )
}
