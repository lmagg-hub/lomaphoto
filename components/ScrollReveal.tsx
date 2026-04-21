'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'left' | 'right' | 'none'
}

export default function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = 'up',
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const initialY = direction === 'up' ? 30 : 0
  const initialX = direction === 'left' ? -38 : direction === 'right' ? 38 : 0
  const isImage = direction === 'left' || direction === 'right'

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: initialY, x: initialX }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: isImage ? 1.0 : 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
