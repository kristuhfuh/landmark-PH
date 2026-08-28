import { useEffect, useRef } from 'react'
import gsap from 'gsap'

// Subtle 3D tilt + glare-free lift on mouse move. Skips touch devices and
// respects prefers-reduced-motion.
export default function useTilt({ max = 8, scale = 1.02 } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    const isTouch = window.matchMedia('(hover: none)').matches
    if (prefersReducedMotion || isTouch) return

    const quickX = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power3.out' })
    const quickY = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power3.out' })
    const quickScale = gsap.quickTo(el, 'scale', { duration: 0.4, ease: 'power3.out' })

    function onMove(e) {
      const rect = el.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width - 0.5
      const py = (e.clientY - rect.top) / rect.height - 0.5
      quickX(px * max)
      quickY(-py * max)
      quickScale(scale)
    }
    function onLeave() {
      quickX(0)
      quickY(0)
      quickScale(1)
    }

    gsap.set(el, { transformPerspective: 800 })
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [max, scale])

  return ref
}
