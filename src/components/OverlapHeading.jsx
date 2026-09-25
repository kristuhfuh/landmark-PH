import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Media from './Media'

gsap.registerPlugin(ScrollTrigger)

/**
 * Editorial "big italic word over a photo" pattern. The heading is broken
 * into two lines that overlap the image from opposite sides — top line slides
 * in from the left over the top edge of the photo, bottom line slides in from
 * the right over the bottom edge. Photo has a subtle parallax as you scroll.
 *
 * Props:
 *   eyebrow, topLine, bottomLine (italic display), imageUrl, imageAlt,
 *   caption (small note below the image), align ('left' | 'right')
 */
export default function OverlapHeading({
  eyebrow,
  topLine,
  bottomLine,
  imageUrl,
  imageAlt = '',
  caption,
  align = 'left',
}) {
  const sectionRef = useRef(null)
  const imgRef = useRef(null)
  const topRef = useRef(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imgRef.current,
        { yPercent: -8, scale: 1.1 },
        {
          yPercent: 8,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
          },
        }
      )

      gsap.fromTo(
        topRef.current,
        { xPercent: -6, opacity: 0 },
        {
          xPercent: 0,
          opacity: 1,
          ease: 'expo.out',
          duration: 1.4,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      gsap.fromTo(
        bottomRef.current,
        { xPercent: 6, opacity: 0 },
        {
          xPercent: 0,
          opacity: 1,
          ease: 'expo.out',
          duration: 1.4,
          delay: 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const photoAlign = align === 'right' ? 'md:ml-auto' : 'md:mr-auto'
  const topAlign = align === 'right' ? 'md:right-8 text-right' : 'md:left-8 text-left'
  const bottomAlign = align === 'right' ? 'md:left-8 text-left' : 'md:right-8 text-right'

  return (
    <section
      ref={sectionRef}
      className="relative bg-sand text-ink py-24 md:py-40 px-6 md:px-10 overflow-hidden"
    >
      {eyebrow && (
        <p className="max-w-6xl mx-auto text-orange-dark text-xs tracking-widest2 uppercase mb-10">
          {eyebrow}
        </p>
      )}

      <div className="relative max-w-6xl mx-auto">
        {/* Photo — 3:4 slab with parallax inner image */}
        <div className={`relative w-full md:w-[62%] aspect-[4/5] overflow-hidden ${photoAlign}`}>
          <div ref={imgRef} className="absolute -inset-[10%]">
            <Media
              src={imageUrl}
              alt={imageAlt}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-marine-dark/15 pointer-events-none" />
        </div>

        {/* Top line — overlaps the top edge of the photo */}
        <h2
          ref={topRef}
          className={`absolute z-10 top-4 md:top-6 left-4 ${topAlign} font-display leading-[0.85] tracking-tight text-marine-dark`}
          style={{ fontSize: 'clamp(3rem, 11vw, 10rem)' }}
        >
          {topLine}
        </h2>

        {/* Bottom line — italic, overlaps the bottom edge */}
        <h2
          ref={bottomRef}
          className={`absolute z-10 bottom-4 md:bottom-10 right-4 ${bottomAlign} font-display italic leading-[0.85] tracking-tight text-orange-dark`}
          style={{ fontSize: 'clamp(3rem, 13vw, 12rem)' }}
        >
          {bottomLine}
        </h2>

        {caption && (
          <p className={`mt-8 max-w-sm text-ink/60 text-sm leading-relaxed ${
            align === 'right' ? 'md:mr-auto' : 'md:ml-auto'
          }`}>
            {caption}
          </p>
        )}
      </div>
    </section>
  )
}
