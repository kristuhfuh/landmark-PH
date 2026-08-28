import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useRevealOnScroll from '../hooks/useRevealOnScroll'
import { useContent } from '../lib/content'
import { openBookingModal } from './BookingModal'

gsap.registerPlugin(ScrollTrigger)

export default function FlagshipAttraction() {
  const ref = useRevealOnScroll({ stagger: 0.08 })
  const imgRef = useRef(null)
  const indexRef = useRef(null)
  const flagship = useContent('flagship')

  const eyebrow = flagship.eyebrow || 'The Signature Attraction'
  const heading = flagship.heading || 'The world,'
  const headingItalic = flagship.headingItalic || 'flipped.'
  const body =
    flagship.body ||
    'An upside-down attraction built from a concept with no equivalent anywhere else — every room, corridor and fixture inverted, gravity reasoned through rather than simulated.'
  const note = flagship.note
  const bgImage = flagship.backgroundImage || '/flagship-upside-down.png'
  const overlay = flagship.overlayColor || '#001F3F'
  const stats = flagship.stats || [
    { label: 'Concept', value: 'World-first' },
    { label: 'Format', value: 'Walk-through' },
    { label: 'Duration', value: '45 min' },
    { label: 'Opens', value: 'Phase One' },
  ]
  const ctaLabel = flagship.ctaLabel || 'Reserve a walkthrough'
  const indexNumber = flagship.indexNumber || '01'

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Slow parallax drift on the background photo — makes the ship feel
      // like it's floating in place while the copy scrolls past.
      gsap.to(imgRef.current, {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.6,
        },
      })

      // The giant "01" scale-index drifts up faster than the photo so
      // it feels layered above.
      gsap.to(indexRef.current, {
        yPercent: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.6,
        },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="the-flagship"
      ref={ref}
      className="bg-sand text-ink min-h-[130vh] py-32 md:py-48 px-6 md:px-10 relative overflow-hidden flex items-center"
    >
      {/* Full-bleed photo with parallax + dark overlay */}
      <div className="absolute inset-0">
        <div ref={imgRef} className="absolute -inset-[8%]">
          <img
            src={bgImage}
            alt="The upside-down ship attraction"
            className="h-full w-full object-cover"
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to right, ${overlay}f2, ${overlay}b3, ${overlay}26 65%, ${overlay}1a)`,
          }}
        />
      </div>

      {/* Giant scale number pinned to the right — editorial "01" mark. */}
      <div
        ref={indexRef}
        aria-hidden="true"
        className="pointer-events-none select-none absolute right-4 md:right-14 top-16 md:top-24 z-0 font-display italic text-orange-light/20 leading-none"
        style={{ fontSize: 'clamp(10rem, 26vw, 26rem)' }}
      >
        {indexNumber}
      </div>

      {/* Vertical rule label — editorial "spine" that anchors the section. */}
      <div className="hidden md:flex absolute left-8 top-0 bottom-0 z-10 flex-col items-center justify-center gap-6">
        <span className="h-24 w-px bg-sand/25" />
        <span className="text-sand/60 text-[10px] tracking-widest2 uppercase [writing-mode:vertical-rl] rotate-180">
          The Flagship · No. {indexNumber}
        </span>
        <span className="h-24 w-px bg-sand/25" />
      </div>

      <div className="max-w-6xl md:ml-20 lg:ml-48 relative z-10 w-full">
        <div className="max-w-xl">
          <p className="reveal text-orange-light text-xs tracking-widest2 uppercase mb-6">
            {eyebrow}
          </p>
          <h2 className="reveal text-sand font-display text-4xl md:text-6xl lg:text-7xl leading-[1.02] mb-8">
            {heading} <span className="italic text-orange-light">{headingItalic}</span>
          </h2>
          <p className="reveal text-sand/85 leading-relaxed mb-10 max-w-md whitespace-pre-line">
            {body}
          </p>

          {/* Editorial stat row — the ship's spec at a glance. */}
          <dl className="reveal grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-6 mb-10 max-w-lg border-t border-sand/25 pt-8">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="text-orange-light/80 text-[10px] tracking-widest2 uppercase mb-2">
                  {s.label}
                </dt>
                <dd className="font-display italic text-sand text-xl md:text-2xl">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="reveal flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => openBookingModal('walkthrough')}
              className="inline-flex items-center gap-3 bg-orange-dark text-sand px-8 py-3.5 text-xs tracking-widest2 uppercase hover:bg-orange transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand"
            >
              {ctaLabel}
              <span aria-hidden="true">→</span>
            </button>
            {note && (
              <div className="inline-flex items-center gap-3 border border-orange-light/40 px-4 py-2 text-xs tracking-wide text-orange-light uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-light animate-pulse" />
                {note}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
