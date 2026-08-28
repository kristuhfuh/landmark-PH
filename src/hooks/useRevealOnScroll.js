import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { revealOnScroll } from '../lib/animations'

/**
 * Attach the standard `.reveal` fade-and-rise animation to any elements
 * inside the returned ref. Usage:
 *   const sectionRef = useRevealOnScroll({ stagger: 0.1 })
 *   return <section ref={sectionRef}>...</section>
 */
export default function useRevealOnScroll(opts = {}) {
  const ref = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      revealOnScroll('.reveal', ref, opts)
    }, ref)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return ref
}
