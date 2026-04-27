'use client'

import { useEffect } from 'react'

// Reads the URL hash on mount and smooth-scrolls to the matching section.
// Used on the homepage so /#galerie, /#videografie etc. land correctly
// when navigating from a subpage.
export default function ScrollToHash() {
  useEffect(() => {
    const hash = window.location.hash
    if (!hash) return
    // Wait for page to render fully and Lenis to initialise
    const t = setTimeout(() => {
      const el = document.querySelector(hash)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 350)
    return () => clearTimeout(t)
  }, [])

  return null
}
