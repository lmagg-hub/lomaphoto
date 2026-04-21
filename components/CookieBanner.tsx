'use client'

import { useState, useEffect } from 'react'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('cookie-consent')) {
      // Small delay so banner doesn't flash immediately on load
      const t = setTimeout(() => setVisible(true), 800)
      return () => clearTimeout(t)
    }
  }, [])

  const respond = (choice: 'accepted' | 'declined') => {
    localStorage.setItem('cookie-consent', choice)
    window.dispatchEvent(new Event('cookie-consent-update'))
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[200] border-t border-dark-200"
      style={{ background: 'rgba(10,10,10,0.97)', backdropFilter: 'blur(12px)' }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-light-muted font-sans text-sm leading-relaxed max-w-xl">
          Wir verwenden Google Analytics um unsere Website zu verbessern.{' '}
          <a href="/datenschutz" className="text-light-dim underline underline-offset-2 hover:text-light transition-colors duration-200">
            Mehr erfahren
          </a>
        </p>

        <div className="flex gap-3 shrink-0">
          <button
            onClick={() => respond('declined')}
            className="px-6 py-2.5 text-xs tracking-widest uppercase font-sans border border-dark-300 text-light-dim hover:border-light-muted hover:text-light-muted transition-all duration-300"
          >
            Ablehnen
          </button>
          <button
            onClick={() => respond('accepted')}
            className="px-6 py-2.5 text-xs tracking-widest uppercase font-sans border border-gold text-gold hover:bg-gold hover:text-dark transition-all duration-300"
          >
            Akzeptieren
          </button>
        </div>
      </div>
    </div>
  )
}
