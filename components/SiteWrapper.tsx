'use client'

import { usePathname } from 'next/navigation'
import { type ReactNode } from 'react'
import LenisProvider from './LenisProvider'
import ScrollToTop from './ScrollToTop'

export default function SiteWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  // Don't apply Lenis or site UI chrome inside Sanity Studio —
  // Lenis intercepts wheel events globally and breaks Studio's scroll panels.
  if (pathname?.startsWith('/studio')) {
    return <>{children}</>
  }

  return (
    <LenisProvider>
      {children}
      <ScrollToTop />
    </LenisProvider>
  )
}
