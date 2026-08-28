import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import * as LucideIcons from 'lucide-react'
import { Dot } from 'lucide-react'
import { parallaxLayer } from '../lib/animations'
import useRevealOnScroll from '../hooks/useRevealOnScroll'
import PinnedCarousel, { CarouselSlide } from './PinnedCarousel'
import SplitHeading from './SplitHeading'
import CountUp from './CountUp'
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
          <img
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
              onClick={() => openBookingModal('table')}
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
          const Icon = (slide.icon && LucideIcons[slide.icon]) || Dot
          return (
            <article
              key={slide.title || i}
              className="relative h-[80vh] w-full overflow-hidden"
            >
              {slide.imageUrl && (
                <>
                  <img
                    src={slide.imageUrl}
                    alt={slide.title || ''}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/10" />
                </>
              )}
              <div className="relative z-10 h-full flex flex-col justify-end p-6 pb-10">
                <span className="text-orange-light font-display italic text-sm tabular-nums mb-2">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <Icon size={26} className="text-orange-light mb-3" strokeWidth={1.5} />
                <h3 className="font-display text-3xl mb-3">{slide.title}</h3>
                <CountUp
                  value={slide.area}
                  className="text-orange-light text-xs tracking-wide whitespace-nowrap mb-3 inline-block"
                />
                <p className="text-sand/85 text-sm leading-relaxed max-w-md">{slide.body}</p>
              </div>
            </article>
          )
        })}
      </div>

      {/* Tablet+: pinned horizontal carousel */}
      <div className="hidden md:block">
        <PinnedCarousel
          className="bg-ink"
          slideImages={slides.map((s) => s.imageUrl || '')}
          slideTitles={slides.map((s) => s.title || '')}
        >
          {slides.map((slide, idx) => {
            const Icon = (slide.icon && LucideIcons[slide.icon]) || Dot
            return (
              <CarouselSlide key={slide.title || idx}>
                <div className="relative h-[70vh] md:h-[75vh] w-full overflow-hidden flex items-end bg-ink">
                  {slide.imageUrl && (
                    <>
                      <img
                        src={slide.imageUrl}
                        alt={slide.title || ''}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/10" />
                    </>
                  )}
                  {/* Editorial index in the top-left corner of each slide. */}
                  <span
                    aria-hidden="true"
                    className="absolute top-8 left-8 md:top-10 md:left-12 z-10 font-display italic text-orange-light/80 text-sm tabular-nums"
                  >
                    {String(idx + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                  </span>
                  <div className="relative z-10 p-8 md:p-12 text-sand max-w-lg">
                    <Icon size={30} className="text-orange-light mb-6" strokeWidth={1.5} />
                    <div className="flex items-baseline gap-4 mb-4">
                      <h3 className="font-display text-3xl md:text-4xl">{slide.title}</h3>
                      <CountUp
                        value={slide.area}
                        className="text-orange-light text-xs tracking-wide whitespace-nowrap"
                      />
                    </div>
                    <p className="text-sand/85 text-sm md:text-base leading-relaxed">{slide.body}</p>
                  </div>
                </div>
              </CarouselSlide>
            )
          })}
        </PinnedCarousel>
      </div>
    </section>
  )
}
