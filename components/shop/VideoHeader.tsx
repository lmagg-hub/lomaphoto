'use client'

import { useRef, useState, useEffect } from 'react'

export default function VideoHeader() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.addEventListener('canplay', () => setLoaded(true))
    v.load()
  }, [])

  return (
    <div
      style={{
        position: 'relative',
        height: '50vh',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Gradient fallback */}
      <div className="hero-gradient-bg" style={{ position: 'absolute', inset: 0 }} />

      {/* Video */}
      <video
        ref={videoRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 1s ease',
        }}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onError={() => setLoaded(false)}
      >
        <source src="/shop.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      {/* Centered text */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 24px',
          boxSizing: 'border-box',
        }}
      >
        <p
          className="font-sans"
          style={{
            fontSize: '10px',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.55)',
            marginBottom: '16px',
          }}
        >
          lomaphoto
        </p>
        <p
          aria-hidden="true"
          className="font-serif font-light"
          style={{
            fontSize: 'clamp(2rem, 6vw, 5rem)',
            letterSpacing: '0.2em',
            color: '#fff',
            margin: '0 0 16px',
            lineHeight: 1,
          }}
        >
          Fine Art Prints
        </p>
        <p
          className="font-sans font-light"
          style={{
            fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.6)',
          }}
        >
          Handgefertigt. Limitiert. Unvergesslich.
        </p>
      </div>
    </div>
  )
}
