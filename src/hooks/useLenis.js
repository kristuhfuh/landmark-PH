import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function useLenis() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) return

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    })

    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    // Recalculate all ScrollTrigger measurements once every image has
    // finished loading. The pinned carousels measure horizontal scroll
    // distance from real image widths — without this, a slide can be
    // measured before its photo loads and end up with a collapsed,
    // unscrollable range (the exact defect found on the reference site).
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)
    if (document.readyState === 'complete') onLoad()

    return () => {
      window.removeEventListener('load', onLoad)
      lenis.destroy()
      gsap.ticker.remove(lenis.raf)
    }
  }, [])
}
