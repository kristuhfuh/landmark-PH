import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import CircleButton from './CircleButton'
import { useContent } from '../lib/content'

export default function Hero() {
  const sectionRef = useRef(null)
  const scrollLineRef = useRef(null)
  const hero = useContent('hero')

  const eyebrow = hero.eyebrow || 'Port Harcourt · Now Open Daily'
  const line1 = hero.headingLine1 || 'A place to'
  const line2 = hero.headingLine2 || 'return to.'
  const ctaLabel = hero.ctaLabel || 'View the grounds'
  const ctaHref = hero.ctaHref || '#the-concept'
  const watermark = hero.watermark || 'Cove'
  const badge = hero.badge || 'Now open'

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-rise', {
        opacity: 0,
        y: 32,
        duration: 1.1,
        ease: 'power3.out',
        stagger: 0.12,
        delay: 0.15,
      })

      // Scroll indicator line — perpetually pulses down to signal "there's
      // more below" without needing an animated icon.
      if (scrollLineRef.current) {
        gsap.fromTo(
          scrollLineRef.current,
          { scaleY: 0.2, transformOrigin: 'top' },
          {
            scaleY: 1,
            duration: 1.8,
            ease: 'power2.inOut',
            repeat: -1,
            yoyo: true,
          }
        )
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative h-[110svh] md:h-[150svh] w-full"
    >
      {/* Italic script watermark — sits behind the main heading, a big
          ambient word that echoes the resort's spirit. */}
      <span
        aria-hidden="true"
        className="hero-rise absolute inset-x-0 top-[38%] md:top-[32%] -translate-y-1/2 text-center font-display italic text-sand/[0.08] pointer-events-none select-none leading-none whitespace-nowrap"
        style={{ fontSize: 'clamp(10rem, 32vw, 34rem)' }}
      >
        {watermark}
      </span>

      <div className="relative z-10 h-[100svh] flex flex-col items-center justify-center text-center px-6">
        <div className="hero-rise flex items-center gap-3 mb-8">
          {badge && (
            <span className="inline-flex items-center gap-2 border border-sand/40 text-sand/85 text-[10px] tracking-widest2 uppercase px-3 py-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 rounded-full bg-orange-light animate-ping opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange-light" />
              </span>
              {badge}
            </span>
          )}
          <span className="text-sand/70 text-[11px] md:text-xs tracking-widest2 uppercase">
            {eyebrow}
          </span>
        </div>

        <h1
          className="hero-rise font-display font-light text-sand leading-[0.95] tracking-tight max-w-6xl"
          style={{ fontSize: 'clamp(3rem, 11vw, 8.5rem)' }}
        >
          {line1}
          <br />
          <span className="italic text-orange-light font-normal">{line2}</span>
        </h1>

        <div className="hero-rise mt-14">
          <CircleButton as="a" href={ctaHref} size="md" tone="sand">
            {ctaLabel}
          </CircleButton>
        </div>
      </div>

      {/* Scroll indicator — animated pulsing line + hairline label. */}
      <div className="absolute bottom-8 right-6 md:right-10 z-10 hidden sm:flex items-end gap-3 text-sand/60 text-[11px] tracking-widest2 uppercase">
        <div className="relative h-14 w-px overflow-hidden">
          <div
            ref={scrollLineRef}
            className="absolute inset-x-0 top-0 h-full bg-sand/70"
          />
        </div>
        Scroll
      </div>

      {/* Bottom-left location marker — a small "you are here" beat that adds
          editorial specificity to the hero. */}
      <div className="absolute bottom-8 left-6 md:left-10 z-10 hidden sm:flex flex-col text-sand/60 text-[11px] tracking-widest2 uppercase">
        <span className="font-display italic text-sand/80 text-base normal-case tracking-normal">
          04.75° N · 07.00° E
        </span>
        <span className="mt-1">Port Harcourt · Rivers</span>
      </div>
    </section>
  )
}
