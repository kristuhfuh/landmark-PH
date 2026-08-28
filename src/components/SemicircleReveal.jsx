import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Big sand-colored semicircle that emerges from the bottom of a photo section
 * as the user scrolls in. Two-phase choreography:
 *   1. Photo scales down from 1.2 → 1 as the section enters — the image
 *      "settles" into the viewport, feels like the camera has just arrived.
 *   2. Once the photo is settled, the sand semicircle grows up from nothing
 *      to cover the lower two-thirds of the frame.
 *   3. Heading fades up inside the arc once it's mostly in place, with a
 *      supporting line below.
 */
export default function SemicircleReveal({
  imageUrl,
  imageAlt = '',
  heading,
  subheading,
  callouts = [],
  className = '',
}) {
  const sectionRef = useRef(null)
  const imageRef = useRef(null)
  const circleRef = useRef(null)
  const headingRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Phase 1 — photo enters and settles into the viewport first.
      gsap.fromTo(
        imageRef.current,
        { scale: 1.25 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'top 25%',
            scrub: 0.5,
          },
        }
      )

      // Phase 2 — starts only after the photo has finished settling. The
      // arc scales from a small nub up to the huge semicircle that fills
      // the lower half of the frame.
      gsap.set(circleRef.current, { scale: 0.05, opacity: 0 })
      gsap.to(circleRef.current, {
        scale: 1,
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 25%',
          end: 'top -15%',
          scrub: 0.6,
        },
      })

      // Heading fades in and rises once the arc is mostly in place.
      gsap.fromTo(
        headingRef.current,
        { yPercent: 30, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          ease: 'expo.out',
          duration: 1.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 10%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [heading])

  return (
    <section
      ref={sectionRef}
      className={`relative w-full h-[110vh] md:h-[130vh] overflow-hidden ${className}`}
    >
      {/* Full-bleed photo, parallax-scaled during phase 1. */}
      <div ref={imageRef} className="absolute inset-0 will-change-transform">
        <img
          src={imageUrl}
          alt={imageAlt}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-marine-dark/25 pointer-events-none" />

      {/* Callouts pinned along the top as a symmetric chip strip so they
          don't pull the centered heading composition off-axis. */}
      {callouts.length > 0 && (
        <ul className="absolute top-8 md:top-12 inset-x-0 z-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sand text-[11px] md:text-xs px-6">
          {callouts.map((c, i) => (
            <li
              key={c}
              className="tracking-widest2 uppercase flex items-center gap-6"
            >
              {c}
              {i < callouts.length - 1 && (
                <span
                  aria-hidden="true"
                  className="hidden md:inline-block h-px w-6 bg-orange-light/70"
                />
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Semicircle */}
      <div
        ref={circleRef}
        aria-hidden="true"
        className="absolute left-1/2 -translate-x-1/2 w-[180vw] md:w-[130vw] aspect-square rounded-full bg-sand"
        style={{ bottom: '-30%', transformOrigin: 'center bottom' }}
      />

      {/* Heading + supporting copy, centered inside the arc. */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center justify-end pb-8 md:pb-14 px-6 text-center">
        <div ref={headingRef} className="max-w-4xl mx-auto">
          <h2
            className="font-display text-ink leading-[0.9] tracking-tight"
            style={{ fontSize: 'clamp(3rem, 11vw, 11rem)' }}
          >
            {heading}
          </h2>
          {subheading && (
            <p className="mt-6 md:mt-8 text-ink/70 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
              {subheading}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
