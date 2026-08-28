import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(SplitText, ScrollTrigger)

/**
 * Editorial split-text reveal for section headings. Each word rises + fades in
 * with a staggered timing as the heading enters view. Falls back to a plain
 * heading if SplitText isn't available.
 *
 * Props: `as` (element to render, default 'h2'), `className`, `children`.
 */
export default function SplitHeading({
  as: Tag = 'h2',
  className = '',
  splitBy = 'words',
  stagger = 0.06,
  children,
}) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    const ctx = gsap.context(() => {
      const split = new SplitText(ref.current, { type: splitBy })
      const targets = splitBy === 'chars' ? split.chars : split.words
      gsap.from(targets, {
        yPercent: 110,
        opacity: 0,
        duration: 1.1,
        ease: 'expo.out',
        stagger,
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      })
    }, ref)
    return () => ctx.revert()
  }, [children, splitBy, stagger])

  return (
    <Tag ref={ref} className={className} style={{ overflow: 'hidden' }}>
      {children}
    </Tag>
  )
}
