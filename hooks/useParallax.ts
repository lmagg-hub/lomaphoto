import { useEffect, useRef } from 'react'

/**
 * Attach the returned ref to any element for a whisper-subtle parallax effect.
 *
 * speed  – 0 = stationary background, 1 = full scroll speed (no parallax).
 * maxPx  – maximum translateY displacement in pixels.
 *
 * Desktop-only (pointer:fine). IntersectionObserver stops the RAF loop when
 * the element is off-screen. Lerp smoothing gives a natural ease-out feel.
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(
  speed: number,
  maxPx = 40
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof window === 'undefined') return
    if (!window.matchMedia('(pointer: fine)').matches) return

    el.style.willChange = 'transform'

    let rafId = 0
    let visible = false
    let current = 0

    const target = () => {
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const dist = rect.top + rect.height * 0.5 - vh * 0.5
      const raw = dist * (1 - speed)
      return Math.max(-maxPx, Math.min(maxPx, raw))
    }

    const tick = () => {
      if (!visible) return
      current += (target() - current) * 0.08   // ease-out cubic feel
      el.style.transform = `translateY(${current.toFixed(2)}px)`
      rafId = requestAnimationFrame(tick)
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) {
          cancelAnimationFrame(rafId)
          rafId = requestAnimationFrame(tick)
        } else {
          cancelAnimationFrame(rafId)
        }
      },
      { rootMargin: '200px' }
    )

    io.observe(el)

    return () => {
      io.disconnect()
      cancelAnimationFrame(rafId)
      el.style.willChange = ''
      el.style.transform = ''
    }
  }, [speed, maxPx])

  return ref
}
