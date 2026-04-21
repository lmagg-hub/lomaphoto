'use client'

import { useState, useEffect } from 'react'
import { GoogleAnalytics } from '@next/third-parties/google'

const GA_ID = 'G-KMCTWLZ4FK'

export default function Analytics() {
  const [consent, setConsent] = useState<string | null>(null)

  useEffect(() => {
    // Read initial consent from localStorage
    setConsent(localStorage.getItem('cookie-consent'))

    // Listen for consent changes from the banner
    const handler = () => setConsent(localStorage.getItem('cookie-consent'))
    window.addEventListener('cookie-consent-update', handler)
    return () => window.removeEventListener('cookie-consent-update', handler)
  }, [])

  // Never load in development
  if (process.env.NODE_ENV !== 'production') return null
  // Only load when explicitly accepted
  if (consent !== 'accepted') return null

  return <GoogleAnalytics gaId={GA_ID} />
}
