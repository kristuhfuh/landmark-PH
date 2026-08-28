import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * Editorial custom cursor. A tiny circle that follows the pointer with a
 * lerp and scales up when the user hovers something interactive. Hidden on
 * touch devices via a matchMedia check.
 *
 * Does NOT hide the native cursor — sits on top as an accent. Removes native
 * pointer altogether would break keyboard users' focus rings on some browsers.
 */
export default function CustomCursor() {
  const ringRef = useRef(null)
  const dotRef = useRef(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (!ringRef.current || !dotRef.current) return

    const ringX = gsap.quickTo(ringRef.current, 'x', { duration: 0.35, ease: 'power3.out' })
    const ringY = gsap.quickTo(ringRef.current, 'y', { duration: 0.35, ease: 'power3.out' })
    const dotX = gsap.quickTo(dotRef.current, 'x', { duration: 0.08, ease: 'power3.out' })
    const dotY = gsap.quickTo(dotRef.current, 'y', { duration: 0.08, ease: 'power3.out' })

    const onMove = (e) => {
      ringX(e.clientX)
      ringY(e.clientY)
      dotX(e.clientX)
      dotY(e.clientY)
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    // Grow the ring on hover of interactive elements.
    const grow = () => gsap.to(ringRef.current, { scale: 2.4, borderColor: 'rgba(140, 68, 8, 0.9)', duration: 0.35, ease: 'power3.out' })
    const shrink = () => gsap.to(ringRef.current, { scale: 1, borderColor: 'rgba(0, 5, 41, 0.55)', duration: 0.35, ease: 'power3.out' })

    const bindTargets = () => {
      const targets = document.querySelectorAll(
        'a, button, [role="button"], input, textarea, label, [data-cursor-grow]'
      )
      targets.forEach((el) => {
        el.addEventListener('mouseenter', grow)
        el.addEventListener('mouseleave', shrink)
      })
      return targets
    }

    // Re-bind after client-side navigation / hydration (safe overkill for SPA).
    let targets = bindTargets()
    const observer = new MutationObserver(() => {
      targets.forEach((el) => {
        el.removeEventListener('mouseenter', grow)
        el.removeEventListener('mouseleave', shrink)
      })
      targets = bindTargets()
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      observer.disconnect()
      targets.forEach((el) => {
        el.removeEventListener('mouseenter', grow)
        el.removeEventListener('mouseleave', shrink)
      })
    }
  }, [])

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        className="fixed top-0 left-0 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border pointer-events-none z-[100] mix-blend-difference hidden md:block"
        style={{ borderColor: 'rgba(0, 5, 41, 0.55)' }}
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className="fixed top-0 left-0 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-marine-dark pointer-events-none z-[100] mix-blend-difference hidden md:block"
      />
    </>
  )
}
