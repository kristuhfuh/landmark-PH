import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Pinned horizontal panorama for desktop; on mobile we fall back to a
 * vertical stack because pinned horizontal scroll on touch feels aggressive.
 *
 * Structure:
 *   [pinned viewport (>= md)]
 *     [oversize track: photo + gradient + label stack]
 *   [vertical stack (< md)]
 */
export default function HorizontalPanorama({
  imageUrl,
  imageAlt = '',
  eyebrow,
  heading,
  chapters = [],
}) {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(min-width: 768px)').matches) return

    const ctx = gsap.context(() => {
      const track = trackRef.current
      // Total horizontal travel = track width - viewport width, so the
      // rightmost chapter lands exactly at the right edge on the last frame.
      const distance = () => track.scrollWidth - window.innerWidth

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      })

      // Each chapter fades and rises as it enters the visible frame. Uses
      // the containing ScrollTrigger to derive per-chapter thresholds off
      // the horizontal-scroll progress.
      const chapterEls = track.querySelectorAll('[data-chapter]')
      chapterEls.forEach((el, i) => {
        const leftPct = parseFloat(el.dataset.left)
        // Chapter is "in view" when the track has moved so that its
        // left position sits between 15% and 85% of the viewport.
        const trigger = tween.scrollTrigger
        gsap.fromTo(
          el,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: () => {
                const dist = distance()
                if (dist <= 0) return trigger.start
                // Fraction of horizontal travel where this chapter reaches
                // the right edge minus 15% of viewport.
                const trackW = track.scrollWidth
                const trackLeftPx = (leftPct / 100) * trackW
                const enterPx = Math.max(0, trackLeftPx - window.innerWidth * 0.85)
                return trigger.start + enterPx
              },
              end: () => {
                const dist = distance()
                if (dist <= 0) return trigger.end
                const trackW = track.scrollWidth
                const trackLeftPx = (leftPct / 100) * trackW
                const enterPx = Math.max(0, trackLeftPx - window.innerWidth * 0.55)
                return trigger.start + enterPx
              },
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          }
        )
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [chapters.length])

  return (
    <>
      {/* DESKTOP: pinned horizontal panorama */}
      <section
        ref={sectionRef}
        className="relative hidden md:block h-screen w-full overflow-hidden bg-ink text-sand"
      >
        <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-6 md:px-10 pt-8 pointer-events-none">
          <span className="text-orange-light text-xs tracking-widest2 uppercase">
            {eyebrow}
          </span>
          <span className="text-sand/60 text-xs tracking-widest2 uppercase">
            Scroll →
          </span>
        </div>

        <div
          ref={trackRef}
          className="absolute inset-y-0 left-0 will-change-transform"
          style={{ width: 'max(300vw, 3200px)' }}
        >
          <img
            src={imageUrl}
            alt={imageAlt}
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(180deg, rgb(var(--c-ink) / 0.55) 0%, rgb(var(--c-ink) / 0.15) 40%, rgb(var(--c-ink) / 0.6) 100%)',
            }}
          />

          {chapters.map((c, i) => {
            const leftPct = 12 + (i * 76) / Math.max(chapters.length - 1, 1)
            const topOffsets = ['22%', '58%', '30%', '64%', '38%', '54%']
            const top = topOffsets[i % topOffsets.length]
            return (
              <div
                key={c.title}
                data-chapter
                data-left={leftPct}
                className="absolute z-10 max-w-xs"
                style={{ left: `${leftPct}%`, top }}
              >
                <span className="block font-display italic text-orange-light text-sm tabular-nums mb-2">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display text-2xl md:text-4xl leading-tight text-sand">
                  {c.title}
                </h3>
                {c.body && (
                  <p className="mt-2 text-sand/75 text-sm md:text-base leading-relaxed max-w-[22ch]">
                    {c.body}
                  </p>
                )}
              </div>
            )
          })}

          {heading && (
            <div className="absolute left-6 md:left-10 bottom-16 md:bottom-24 z-10 max-w-xl">
              <h2
                className="font-display text-sand leading-[0.95]"
                style={{ fontSize: 'clamp(2.75rem, 6.5vw, 5.5rem)' }}
              >
                {heading}
              </h2>
            </div>
          )}
        </div>
      </section>

      {/* MOBILE: vertical fallback so touch users get a calm, scrollable
          version of the same content instead of a fighting pinned scrub. */}
      <section className="md:hidden bg-ink text-sand py-20 px-6">
        <p className="text-orange-light text-xs tracking-widest2 uppercase mb-4">
          {eyebrow}
        </p>
        {heading && (
          <h2 className="font-display text-4xl leading-[0.95] mb-8">{heading}</h2>
        )}
        <div className="relative w-full h-64 mb-10 overflow-hidden">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-ink/30" />
        </div>
        <ol className="space-y-10">
          {chapters.map((c, i) => (
            <li key={c.title} className="border-t border-sand/15 pt-6">
              <span className="block font-display italic text-orange-light text-sm tabular-nums mb-2">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-display text-2xl leading-tight mb-2">
                {c.title}
              </h3>
              {c.body && (
                <p className="text-sand/75 text-sm leading-relaxed">{c.body}</p>
              )}
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}
