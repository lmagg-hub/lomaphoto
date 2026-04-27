'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import LenisProvider from './LenisProvider'
import ScrollToTop from './ScrollToTop'

export default function SiteWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  // Increment on every navigation (except first render) to re-trigger the overlay
  const [overlayKey, setOverlayKey] = useState(0)
  const isFirst = useRef(true)

  useEffect(() => {
    // Skip studio routes and the very first render
    if (pathname?.startsWith('/studio')) return
    if (isFirst.current) { isFirst.current = false; return }
    setOverlayKey(k => k + 1)
  }, [pathname])

  // Sanity Studio gets no Lenis or transition chrome
  if (pathname?.startsWith('/studio')) {
    return <>{children}</>
  }

  return (
    <LenisProvider>
      {children}
      <ScrollToTop />

      {/* Page transition overlay — remounts on each navigation at opacity 1,
          immediately fades out to 0, revealing the new page */}
      <motion.div
        key={overlayKey}
        aria-hidden="true"
        initial={{ opacity: overlayKey === 0 ? 0 : 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: '#0a0a0a',
          pointerEvents: 'none',
        }}
      />
    </LenisProvider>
  )
}
