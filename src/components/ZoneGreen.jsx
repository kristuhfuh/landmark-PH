import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { parallaxLayer } from '../lib/animations'
import useRevealOnScroll from '../hooks/useRevealOnScroll'
import SplitHeading from './SplitHeading'
import Media from './Media'
import { openBookingModal } from './BookingModal'
import { useContent } from '../lib/content'

export default function ZoneGreen() {
  const heroRef = useRevealOnScroll({ stagger: 0.08 })
  const imgRef = useRef(null)
  const green = useContent('green')

  const zoneLabel = green.zoneLabel || 'Zone Two'
  const title = green.title || 'The Green'
  const intro =
    green.intro ||
    '1,860 sqm concert area anchoring an open-air adventure quarter. Scroll on to move through the rest of it.'
  const heroImage = green.heroImageUrl
  const slides = green.items || []
  const stats = green.stats || [
    { label: 'Concert lawn', value: '1,860 sqm' },
    { label: 'Format', value: 'Open-air' },
    { label: 'Adjacent', value: 'Padel · Football' },
    { label: 'Season', value: 'Year-round' },
  ]
  const ctaLabel = green.ctaLabel || 'Book court time'

  useEffect(() => {
    const ctx = gsap.context(() => {
      parallaxLayer(imgRef.current, heroRef, { yPercent: 14, scrub: 0.6 })
    }, heroRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="the-green">
      {/* Hero */}
      <div ref={heroRef} className="relative h-[75vh] md:h-[90vh] overflow-hidden">
        <div ref={imgRef} className="absolute inset-0 -top-[6%] h-[112%] w-full">
          <Media
            src={heroImage}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/10" />
        </div>
        <div className="relative z-10 h-full flex flex-col justify-end px-6 md:px-10 pb-12 md:pb-16 max-w-6xl mx-auto text-sand">
          <p className="reveal text-orange-light text-xs tracking-widest2 uppercase mb-4">
            {zoneLabel}
          </p>
          <SplitHeading className="font-display text-4xl md:text-6xl lg:text-7xl mb-5 leading-[0.98]">
            {title}
          </SplitHeading>
          <p className="reveal text-sand/85 max-w-lg text-sm md:text-base leading-relaxed mb-10">
            {intro}
          </p>

          <div className="flex flex-wrap items-end gap-x-10 gap-y-6 border-t border-sand/25 pt-6 max-w-3xl">
            {stats.map((s) => (
              <div key={s.label} className="reveal">
                <p className="text-orange-light/80 text-[10px] tracking-widest2 uppercase mb-1.5">
                  {s.label}
                </p>
                <p className="font-display italic text-sand text-lg md:text-xl leading-tight">
                  {s.value}
                </p>
              </div>
            ))}
            <button
              type="button"
              onClick={() => openBookingModal('other')}
              className="reveal ml-auto inline-flex items-center gap-3 border border-orange-light/70 text-sand px-6 py-3 text-xs tracking-widest2 uppercase hover:bg-orange-light hover:text-ink transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-light"
            >
              {ctaLabel}
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile: plain stacked cards, one per attraction. Same content as
          the pinned carousel below, without the horizontal scrub. */}
      <div className="md:hidden bg-ink text-sand">
        {slides.map((slide, i) => {
          return (
            <article
              key={slide.title || i}
              className="relative h-[80vh] w-full overflow-hidden"
            >
              {slide.imageUrl && (
                <>
                  <Media
                    src={slide.imageUrl}
                    alt={slide.title || ''}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/10" />
                </>
              )}
              <div className="relative z-10 h-full flex flex-col justify-end p-6 pb-10">
                <span className="text-orange-light font-display italic text-sm tabular-nums mb-3">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display text-3xl mb-3">{slide.title}</h3>
                <p className="text-sand/85 text-sm leading-relaxed max-w-md">{slide.body}</p>
              </div>
            </article>
          )
        })}
      </div>

      {/* Tablet+: tilted overlapping card row (Lasala-Plaza inspired). */}
      <div className="hidden md:block bg-sand text-ink pt-16 pb-24 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between gap-10 mb-12">
            <h3
              className="font-display text-marine leading-[1.05] max-w-3xl"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 2.75rem)' }}
            >
              Stories, places and moments that shape a day on the{' '}
              <span className="italic">grounds.</span>
            </h3>
            <a
              href="/things-to-do"
              className="shrink-0 inline-flex items-center gap-3 bg-marine-dark text-sand px-6 py-3 rounded-full text-xs tracking-widest2 uppercase hover:bg-marine transition-colors"
            >
              More ideas and plans
              <span aria-hidden="true">→</span>
            </a>
          </div>

          <div className="relative flex items-start justify-center gap-[-24px] md:-mx-6 overflow-x-visible">
            {slides.map((slide, i) => {
              // Alternating tilts + stacked margins create the fanned look.
              const tilts = ['-rotate-3', 'rotate-2', '-rotate-2', 'rotate-3', '-rotate-1']
              const marginTops = ['mt-0', 'mt-6', 'mt-0', 'mt-6', 'mt-0']
              const tilt = tilts[i % tilts.length]
              const topShift = marginTops[i % marginTops.length]
              return (
                <article
                  key={slide.title || i}
                  className={`relative shrink-0 w-[220px] lg:w-[260px] aspect-[3/4.3] overflow-hidden shadow-[0_20px_40px_-20px_rgba(0,0,0,0.35)] bg-ink transition-transform duration-500 hover:rotate-0 hover:z-20 ${tilt} ${topShift}`}
                  style={{ marginLeft: i === 0 ? 0 : '-28px', zIndex: 5 + i }}
                >
                  {slide.imageUrl && (
                    <Media
                      src={slide.imageUrl}
                      alt={slide.title || ''}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-ink/20" />
                  <p className="absolute top-5 left-5 z-10 text-sand text-[10px] tracking-widest2 uppercase">
                    {String(i + 1).padStart(2, '0')} · {zoneLabel}
                  </p>
                  <div className="absolute inset-x-0 bottom-0 z-10 p-5">
                    <h4 className="font-display text-xl lg:text-2xl text-sand leading-tight mb-4">
                      {slide.title}
                    </h4>
                    <a
                      href="/things-to-do"
                      className="inline-flex items-center gap-2 border border-sand/70 text-sand px-3.5 py-1.5 text-[10px] tracking-widest2 uppercase hover:bg-sand hover:text-ink transition-colors"
                    >
                      Learn more
                    </a>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
