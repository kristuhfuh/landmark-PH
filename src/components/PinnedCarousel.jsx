import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * slides: array of { render: () => JSX } OR pass children directly as slide nodes.
 * Each direct child becomes one full-viewport slide; the section pins while
 * scroll progress drives horizontal translation across all slides.
 *
 * Optional props:
 *   `slideImages` — array of URLs, same order as children. When provided, the
 *     wrapper background crossfades to the currently focused slide's image
 *     (blurred, low-opacity) for a cohesive full-bleed feel.
 *   `slideTitles` — same order; used for accessible labels on dot pagination.
 */
export default function PinnedCarousel({
  children,
  className = '',
  slideImages = [],
  slideTitles = [],
}) {
  const wrapperRef = useRef(null)
  const trackRef = useRef(null)
  const tweenRef = useRef(null)
  const slideCount = Array.isArray(children) ? children.length : 1
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    // On mobile the pinned horizontal scrub tends to fight the OS scroll,
    // so skip it entirely — the parent should render a vertical fallback.
    if (!window.matchMedia('(min-width: 768px)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      const track = trackRef.current
      const getDistance = () => track.scrollWidth - window.innerWidth

      const tween = gsap.to(track, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'top top',
          end: () => `+=${Math.max(getDistance(), 1)}`,
          scrub: 0.7,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
      tweenRef.current = tween

      gsap.utils.toArray('.carousel-slide-inner', track).forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0.3, scale: 0.94 },
          {
            opacity: 1,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              containerAnimation: tween,
              start: 'left 75%',
              end: 'left 35%',
              scrub: true,
            },
          }
        )

        // Fires when this slide is the one at viewport centre. Drives the
        // wrapper's background image swap + dot indicator + progress bar.
        ScrollTrigger.create({
          trigger: el,
          containerAnimation: tween,
          start: 'left 60%',
          end: 'left 40%',
          onToggle: (self) => {
            if (self.isActive) setActiveIndex(i)
          },
        })
      })

      return () => tween.scrollTrigger && tween.scrollTrigger.kill()
    }, wrapperRef)
    return () => ctx.revert()
  }, [])

  // Click a dot → scroll to the outer page position that maps to that slide.
  function jumpTo(i) {
    const trigger = tweenRef.current?.scrollTrigger
    if (!trigger) return
    const total = trigger.end - trigger.start
    // Bias slightly past the slide boundary so the onToggle for that slide
    // fires cleanly rather than sitting exactly on the seam.
    const t = (i + 0.35) / slideCount
    const target = trigger.start + total * t
    window.scrollTo({ top: target, behavior: 'smooth' })
  }

  return (
    <div
      ref={wrapperRef}
      className={`relative h-[100svh] overflow-hidden ${className}`}
    >
      {/* Background stack — each slide image sits full-bleed and crossfades
          when it becomes the focused slide. Blurred + dimmed so the actual
          slide card stays the visual focus. */}
      {slideImages.length > 0 && (
        <div className="absolute inset-0 pointer-events-none">
          {slideImages.map((url, i) => (
            <div
              key={url || i}
              className="absolute inset-0 transition-opacity duration-700 ease-out"
              style={{ opacity: activeIndex === i ? 1 : 0 }}
            >
              {url && (
                <img
                  src={url}
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full object-cover scale-110 blur-xl"
                />
              )}
              <div className="absolute inset-0 bg-ink/50" />
            </div>
          ))}
        </div>
      )}

      {/* Top progress bar — thin orange line that widens as slides advance. */}
      <div className="absolute top-0 inset-x-0 z-20 h-0.5 bg-sand/10">
        <div
          className="h-full bg-orange-light transition-[width] duration-500 ease-out"
          style={{ width: `${((activeIndex + 1) / Math.max(slideCount, 1)) * 100}%` }}
          aria-hidden="true"
        />
      </div>

      <div ref={trackRef} className="flex h-full w-max relative">
        {children}
      </div>

      {/* Dot pagination — clickable jump-to-slide. */}
      {slideCount > 1 && (
        <div
          className="absolute bottom-6 md:bottom-8 inset-x-0 z-20 flex items-center justify-center gap-6"
          role="tablist"
          aria-label="Slides"
        >
          <span className="font-display italic text-orange-light text-xs tabular-nums">
            {String(activeIndex + 1).padStart(2, '0')}
          </span>
          <div className="flex items-center gap-2">
            {Array.from({ length: slideCount }).map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={slideTitles[i] || `Slide ${i + 1}`}
                onClick={() => jumpTo(i)}
                className={`h-1 transition-all duration-500 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-light ${
                  i === activeIndex
                    ? 'w-8 bg-orange-light'
                    : 'w-3 bg-sand/30 hover:bg-sand/60'
                }`}
              />
            ))}
          </div>
          <span className="text-sand/60 text-xs tracking-widest2 uppercase tabular-nums">
            of {String(slideCount).padStart(2, '0')}
          </span>
        </div>
      )}
    </div>
  )
}

export function CarouselSlide({ children, className = '' }) {
  return (
    <div className="h-full w-screen flex-shrink-0 flex items-center justify-center px-6 md:px-16">
      <div className={`carousel-slide-inner w-full max-w-4xl ${className}`}>
        {children}
      </div>
    </div>
  )
}
