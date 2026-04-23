'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import type { SiteSettings } from '@/types'

const NAV_LINKS = [
  { label: 'Galerie', href: '#galerie' },
  { label: 'Videografie', href: '#videografie' },
  { label: 'Shop', href: '#shop' },
  { label: 'Über mich', href: '#ueber-mich' },
  { label: 'Kontakt', href: '#kontakt' },
]

export default function Navigation({ settings }: { settings: SiteSettings | null }) {
  const [menuOpen, setMenuOpen] = useState(false)

  // Scroll-driven background — no React re-renders, GPU-animated
  const { scrollY } = useScroll()
  const rawOpacity  = useTransform(scrollY, [0, 100], [0, 1])
  const bgOpacity   = useSpring(rawOpacity, { stiffness: 80, damping: 20, restDelta: 0.001 })

  const handleNavClick = (href: string) => {
    setMenuOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Background layer — opacity driven by scroll position, not a class toggle */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(10, 10, 10, 0.92)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderBottom: '1px solid rgba(255,255,255,0.055)',
          opacity: bgOpacity,
          pointerEvents: 'none',
        }}
      />

      <nav aria-label="Hauptnavigation" className="relative max-w-7xl mx-auto px-6 md:px-10 h-16 md:h-20 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-serif text-xl md:text-2xl tracking-widest text-light hover:text-gold transition-colors duration-300"
        >
          lomaphoto
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <button
                onClick={() => handleNavClick(link.href)}
                className="text-xs tracking-widest uppercase text-light-muted hover:text-light transition-colors duration-300"
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Menü"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <span className={`block w-6 h-px bg-light transition-transform duration-300 ${menuOpen ? 'translate-y-2.5 rotate-45' : ''}`} />
          <span className={`block w-6 h-px bg-light transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-px bg-light transition-transform duration-300 ${menuOpen ? '-translate-y-2.5 -rotate-45' : ''}`} />
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        role="navigation"
        aria-label="Mobile Navigation"
        className={`md:hidden bg-dark-100/95 backdrop-blur-md transition-all duration-300 overflow-hidden ${
          menuOpen ? 'max-h-96 border-b border-dark-200' : 'max-h-0'
        }`}
      >
        <ul className="flex flex-col px-6 pb-6 pt-2 gap-5">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <button
                onClick={() => handleNavClick(link.href)}
                className="text-sm tracking-widest uppercase text-light-muted hover:text-light transition-colors duration-300"
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
