import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Editorial photo reveal — a sand-coloured panel slides off the image
 * (left-to-right, right-to-left, top-down, or bottom-up) as it scrolls
 * into view. Meanwhile the underlying image scales down from 1.15 → 1 for
 * a subtle Ken-Burns finish.
 *
 * Wraps any children (img, video, div with bg image, etc.) so this doesn't
 * care what's inside.
 */
export default function RevealImage({
  children,
  direction = 'right', // 'right' | 'left' | 'down' | 'up'
  className = '',
  duration = 1.2,
}) {
  const wrapperRef = useRef(null)
  const maskRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const initialTransform = {
        right: 'translateX(0%)',
        left: 'translateX(0%)',
        down: 'translateY(0%)',
        up: 'translateY(0%)',
      }[direction]
      const finalTransform = {
        right: 'translateX(101%)',
        left: 'translateX(-101%)',
        down: 'translateY(101%)',
        up: 'translateY(-101%)',
      }[direction]

      gsap.set(maskRef.current, { transform: initialTransform })
      gsap.set(contentRef.current, { scale: 1.15, transformOrigin: 'center center' })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reset',
        },
      })
      tl.to(maskRef.current, {
        transform: finalTransform,
        duration,
        ease: 'expo.inOut',
      })
        .to(
          contentRef.current,
          {
            scale: 1,
            duration: duration * 1.4,
            ease: 'power2.out',
          },
          0
        )
    }, wrapperRef)
    return () => ctx.revert()
  }, [direction, duration])

  return (
    <div ref={wrapperRef} className={`relative overflow-hidden ${className}`}>
      <div ref={contentRef} className="h-full w-full">
        {children}
      </div>
      <div
        ref={maskRef}
        aria-hidden="true"
        className="absolute inset-0 bg-sand pointer-events-none"
      />
    </div>
  )
}
