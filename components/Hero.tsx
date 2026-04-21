'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { SiteSettings } from '@/types'

const WORDS = ['TRAVEL', 'EXPLORE', 'CREATE', 'EMOTIONS']
const PAUSE_MS   = 1500
const INTER_MS   = 500
const DELETE_MS  = 60
const MIN_TYPE   = 80
const MAX_TYPE   = 140

type Phase = 'pre' | 'typing' | 'pause' | 'deleting' | 'inter' | 'done'

function randDelay() {
  return MIN_TYPE + Math.random() * (MAX_TYPE - MIN_TYPE)
}

export default function Hero({ settings }: { settings: SiteSettings | null }) {
  const videoRef    = useRef<HTMLVideoElement>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const gainRef     = useRef<GainNode | null>(null)

  // Keep sound flag in a ref so the state-machine effect never needs it as a dep
  const soundOnRef  = useRef(false)

  const [videoLoaded, setVideoLoaded] = useState(false)
  const [wordIndex,   setWordIndex]   = useState(0)
  const [chars,       setChars]       = useState(0)
  const [phase,       setPhase]       = useState<Phase>('pre')
  const [showName,    setShowName]    = useState(false)
  const [soundOn,     setSoundOn]     = useState(false)

  // Keep ref in sync with state (no extra re-render, no stale closure)
  soundOnRef.current = soundOn

  const title    = settings?.heroTitle    ?? 'Lorenz Magg'
  const subtitle = settings?.heroSubtitle ?? 'Photography & Videography'

  // ── Video ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const onCanPlay = () => setVideoLoaded(true)
    video.addEventListener('canplay', onCanPlay)
    video.load()
    return () => video.removeEventListener('canplay', onCanPlay)
  }, [])

  // ── Video parallax (desktop only): bg moves at ~0.5x scroll speed ────────
  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    el.style.willChange = 'transform'
    let rafId = 0
    const onScroll = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        // translateY down as page scrolls up → video lags behind → depth
        const offset = Math.min(window.scrollY * 0.175, 55)
        el.style.transform = `translateY(${offset}px)`
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafId)
      el.style.willChange = ''
    }
  }, [])

  // ── Web Audio ────────────────────────────────────────────────────────────
  const initAudio = useCallback(() => {
    if (audioCtxRef.current) return
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const gain = ctx.createGain()
      gain.gain.value = 0.07
      gain.connect(ctx.destination)
      audioCtxRef.current = ctx
      gainRef.current     = gain
    } catch { /* not supported */ }
  }, [])

  const playClick = useCallback(() => {
    const ctx  = audioCtxRef.current
    const gain = gainRef.current
    if (!ctx || !gain) return
    try {
      // Short burst of exponentially-decaying noise → mechanical click
      const dur    = 0.035
      const buf    = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * dur), ctx.sampleRate)
      const data   = buf.getChannelData(0)
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.005))
      }
      const src = ctx.createBufferSource()
      src.buffer = buf
      // High-pass makes it click-y rather than rumbly
      const hp = ctx.createBiquadFilter()
      hp.type           = 'highpass'
      hp.frequency.value = 700
      src.connect(hp)
      hp.connect(gain)
      src.start()
    } catch { /* ignore */ }
  }, [])

  const toggleSound = () => {
    if (!soundOn) initAudio()
    setSoundOn(s => !s)
  }

  // ── State machine ────────────────────────────────────────────────────────
  useEffect(() => {
    const word = WORDS[wordIndex] ?? ''

    if (phase === 'pre') {
      const t = setTimeout(() => setPhase('typing'), 800)
      return () => clearTimeout(t)
    }

    if (phase === 'typing') {
      if (chars < word.length) {
        const t = setTimeout(() => {
          if (soundOnRef.current) playClick()
          setChars(c => c + 1)
        }, randDelay())
        return () => clearTimeout(t)
      }
      // Fully typed → pause
      const t = setTimeout(() => setPhase('pause'), 50)
      return () => clearTimeout(t)
    }

    if (phase === 'pause') {
      const t = setTimeout(() => setPhase('deleting'), PAUSE_MS)
      return () => clearTimeout(t)
    }

    if (phase === 'deleting') {
      if (chars > 0) {
        const t = setTimeout(() => {
          if (soundOnRef.current) playClick()
          setChars(c => c - 1)
        }, DELETE_MS)
        return () => clearTimeout(t)
      }
      // Fully deleted → inter-pause
      const t = setTimeout(() => setPhase('inter'), 50)
      return () => clearTimeout(t)
    }

    if (phase === 'inter') {
      const t = setTimeout(() => {
        const next = wordIndex + 1
        if (next >= WORDS.length) {
          // All 4 words done — hand off to 'done' phase
          setPhase('done')
        } else {
          setWordIndex(next)
          setChars(0)
          setPhase('typing')
        }
      }, INTER_MS)
      return () => clearTimeout(t)
    }

    if (phase === 'done') {
      // 1-second pause, then fade in "Lorenz Magg" — typewriter stops
      const t = setTimeout(() => setShowName(true), 1000)
      return () => clearTimeout(t)
    }
  }, [wordIndex, chars, phase, playClick])

  const scrollDown = () =>
    document.querySelector('#galerie')?.scrollIntoView({ behavior: 'smooth' })

  // ── Derived display values ───────────────────────────────────────────────
  const word         = WORDS[wordIndex] ?? ''
  const visibleChars = phase === 'pre' ? 0 : chars
  const displayChars = word.slice(0, visibleChars).split('')
  const isTypingNow  = phase === 'typing'
  const showCursor   = phase !== 'pre' && phase !== 'done' && !showName
  const showTypewriter = !showName

  return (
    <section
      aria-label={`${title} — ${subtitle}`}
      style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}
    >
      {/* Visually-hidden h1 — always in DOM for SEO/screen readers */}
      <h1 className="sr-only">{title} — {subtitle}</h1>

      {/* Gradient fallback — always behind video */}
      <div className="hero-gradient-bg" style={{ position: 'absolute', inset: 0 }} />

      {/* Video */}
      <video
        ref={videoRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-12%', left: 0,
          width: '100%', height: '124%',
          objectFit: 'cover',
          opacity: videoLoaded ? 1 : 0,
          transition: 'opacity 1s ease',
        }}
        autoPlay muted loop playsInline preload="auto"
        onError={() => setVideoLoaded(false)}
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      {/* Vignette */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.1) 70%, rgba(0,0,0,0.65) 100%)',
        }}
      />

      {/* Shimmer — slow diagonal light streak, barely visible */}
      <div
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, zIndex: 3, overflow: 'hidden', pointerEvents: 'none' }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-50%', left: '-20%',
            width: '25%', height: '200%',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)',
            animation: 'heroShimmer 30s linear infinite',
          }}
        />
      </div>

      {/* ── Centered text overlay ── */}
      <div
        style={{
          position: 'absolute', top: 0, left: 0,
          width: '100%', height: '100%',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', zIndex: 10,
          padding: '0 24px', boxSizing: 'border-box',
        }}
      >
        <AnimatePresence mode="wait">

          {/* ── Typewriter phase ── */}
          {showTypewriter && (
            <motion.div
              key="typewriter"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              style={{
                height: 'clamp(3.2rem, 10.5vw, 9.5rem)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {phase !== 'pre' && (
                <span
                  style={{
                    fontFamily: "'Courier New', Courier, monospace",
                    fontSize: 'clamp(2.6rem, 8.5vw, 7.5rem)',
                    fontWeight: 400,
                    color: '#F5F0E8',
                    letterSpacing: '0.22em',
                    textShadow: '0 1px 4px rgba(0,0,0,0.45)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    userSelect: 'none',
                  }}
                >
                  {displayChars.map((char, i) => {
                    const isLast = i === visibleChars - 1
                    const key = isLast && isTypingNow
                      ? `${wordIndex}-s-${visibleChars}`
                      : `${wordIndex}-${i}`
                    return (
                      <span
                        key={key}
                        style={{
                          display: 'inline-block',
                          animation: isLast && isTypingNow
                            ? 'typeStrike 75ms ease-out forwards'
                            : undefined,
                        }}
                      >
                        {char === ' ' ? '\u00A0' : char}
                      </span>
                    )
                  })}

                  {showCursor && (
                    <span
                      aria-hidden="true"
                      style={{
                        display: 'inline-block',
                        width: '3px',
                        height: '0.72em',
                        background: '#F5F0E8',
                        marginLeft: '4px',
                        verticalAlign: 'middle',
                        animation: 'cursorBlink 530ms step-end alternate infinite',
                      }}
                    />
                  )}
                </span>
              )}
            </motion.div>
          )}

          {/* ── Lorenz Magg — fades in after all 4 words, stays permanently ── */}
          {showName && (
            <motion.div
              key="name"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 1 }}
                className="font-sans"
                style={{
                  fontSize: '11px', letterSpacing: '0.4em',
                  textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)',
                }}
              >
                lomaphoto
              </motion.p>

              <p
                aria-hidden="true"
                className="font-serif font-light text-light"
                style={{
                  fontSize: 'clamp(2.8rem, 8vw, 6.5rem)',
                  letterSpacing: '0.15em',
                  lineHeight: 1,
                  margin: 0,
                }}
              >
                {title}
              </p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 1 }}
                className="font-sans font-light"
                style={{
                  fontSize: 'clamp(0.7rem, 2vw, 0.9rem)',
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.65)',
                }}
              >
                {subtitle}
              </motion.p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Scroll arrow — appears once name is visible */}
      <motion.button
        onClick={scrollDown}
        animate={{ opacity: showName ? 1 : 0 }}
        transition={{ delay: 1.8, duration: 1 }}
        style={{
          position: 'absolute', bottom: '32px', left: '50%',
          transform: 'translateX(-50%)', zIndex: 10,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: '8px', background: 'none', border: 'none',
          cursor: 'pointer', color: 'rgba(160,160,160,1)',
        }}
        aria-label="Nach unten scrollen"
      >
        <span
          className="font-sans"
          style={{ fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase' }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: '1px', height: '40px',
            background: 'linear-gradient(to bottom, rgba(160,160,160,1), transparent)',
          }}
        />
      </motion.button>

      {/* Sound toggle — bottom-right corner, very subtle */}
      <button
        onClick={toggleSound}
        aria-label={soundOn ? 'Ton ausschalten' : 'Ton einschalten'}
        style={{
          position: 'absolute', bottom: '28px', right: '20px', zIndex: 10,
          display: 'flex', alignItems: 'center', gap: '6px',
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'rgba(140,140,140,0.65)',
          padding: '6px 8px',
          transition: 'color 0.3s ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'rgba(200,200,200,0.9)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(140,140,140,0.65)')}
      >
        <span
          className="font-sans"
          style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase' }}
        >
          {soundOn ? 'sfx on' : 'sfx off'}
        </span>
        {soundOn ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        )}
      </button>
    </section>
  )
}
