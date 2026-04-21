'use client'

import { ReactNode } from 'react'
import { ReactLenis } from 'lenis/react'

const easing = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))

export default function LenisProvider({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        easing,
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
      }}
    >
      {children}
    </ReactLenis>
  )
}
