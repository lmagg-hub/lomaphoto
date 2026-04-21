'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { SiteSettings } from '@/types'
import ScrollReveal from './ScrollReveal'

export default function Contact({ settings }: { settings: SiteSettings | null }) {
  const [form, setForm] = useState({ name: '', email: '', message: '', website: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const email = settings?.email ?? 'hello@lomaphoto.at'
  const instagramUrl = settings?.instagramUrl ?? 'https://instagram.com/lomaphoto'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error ?? 'Etwas ist schiefgelaufen.')
        setStatus('error')
        return
      }

      setStatus('success')
      setForm({ name: '', email: '', message: '', website: '' })
    } catch {
      setErrorMsg('Netzwerkfehler. Bitte versuche es später.')
      setStatus('error')
    }
  }

  return (
    <section id="kontakt" className="py-24 md:py-32 px-6 md:px-10 max-w-5xl mx-auto">
      <ScrollReveal>
        <div className="text-center mb-16">
          <h2 className="section-heading">Kontakt</h2>
          <p className="section-subheading">Lass uns sprechen</p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
        {/* Info */}
        <ScrollReveal direction="left">
          <div>
            <p className="text-light-muted font-sans text-base leading-relaxed mb-10">
              Hast du ein Projekt im Kopf? Ich freue mich über jede Anfrage — egal ob Portrait,
              Commercial oder Fine Art Print.
            </p>

            <div className="space-y-6">
              <div>
                <p className="text-[10px] tracking-widest uppercase text-light-dim font-sans mb-1">E-Mail</p>
                <a
                  href={`mailto:${email}`}
                  className="text-light hover:text-gold transition-colors duration-300 font-sans text-sm"
                >
                  {email}
                </a>
              </div>

              {settings?.location && (
                <div>
                  <p className="text-[10px] tracking-widest uppercase text-light-dim font-sans mb-1">Standort</p>
                  <p className="text-light font-sans text-sm">{settings.location}</p>
                </div>
              )}
            </div>

            {/* Social icons */}
            <div className="mt-10 pt-8 border-t border-dark-200 flex gap-5">
              {/* Instagram */}
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-light-dim hover:text-gold transition-colors duration-300"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              {/* YouTube */}
              {settings?.youtubeUrl && (
                <a
                  href={settings.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-light-dim hover:text-gold transition-colors duration-300"
                  aria-label="YouTube"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
                  </svg>
                </a>
              )}
              {/* Vimeo */}
              {settings?.vimeoUrl && (
                <a
                  href={settings.vimeoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-light-dim hover:text-gold transition-colors duration-300"
                  aria-label="Vimeo"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.522 3.01 7.522c-.179 0-.806.378-1.881 1.132L0 7.197c1.185-1.044 2.351-2.084 3.501-3.128C5.08 2.701 6.266 1.984 7.055 1.91c1.867-.18 3.016 1.1 3.447 3.838.465 2.953.789 4.789.971 5.507.539 2.45 1.131 3.674 1.776 3.674.502 0 1.256-.796 2.265-2.385 1.004-1.589 1.54-2.797 1.612-3.628.144-1.371-.395-2.061-1.614-2.061-.574 0-1.167.121-1.777.391 1.186-3.868 3.434-5.757 6.762-5.637 2.473.06 3.628 1.664 3.48 4.807z" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </ScrollReveal>

        {/* Form */}
        <ScrollReveal direction="right" delay={0.1}>
          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full text-center py-12"
            >
              <div className="w-12 h-12 border border-gold flex items-center justify-center mb-6">
                <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl font-light text-light mb-3">Danke!</h3>
              <p className="text-light-muted text-sm font-sans">
                Ich melde mich so bald wie möglich bei dir.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* Honeypot — hidden from humans, filled by bots */}
              <input
                type="text"
                name="website"
                value={form.website}
                onChange={handleChange}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0 }}
              />
              <div>
                <label htmlFor="contact-name" className="block text-[10px] tracking-widest uppercase text-light-dim font-sans mb-2">
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border border-dark-300 text-light font-sans text-sm px-4 py-3 focus:outline-none focus:border-gold transition-colors duration-300 placeholder:text-light-dim"
                  placeholder="Dein Name"
                />
              </div>

              <div>
                <label htmlFor="contact-email" className="block text-[10px] tracking-widest uppercase text-light-dim font-sans mb-2">
                  E-Mail
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border border-dark-300 text-light font-sans text-sm px-4 py-3 focus:outline-none focus:border-gold transition-colors duration-300 placeholder:text-light-dim"
                  placeholder="deine@email.at"
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-[10px] tracking-widest uppercase text-light-dim font-sans mb-2">
                  Nachricht
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full bg-transparent border border-dark-300 text-light font-sans text-sm px-4 py-3 focus:outline-none focus:border-gold transition-colors duration-300 placeholder:text-light-dim resize-none"
                  placeholder="Deine Nachricht …"
                />
              </div>

              {status === 'error' && (
                <p className="text-red-400 text-xs font-sans">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-4 text-xs tracking-widest uppercase border border-gold text-gold hover:bg-gold hover:text-dark transition-all duration-300 font-sans disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Wird gesendet …' : 'Nachricht senden'}
              </button>
            </form>
          )}
        </ScrollReveal>
      </div>
    </section>
  )
}
