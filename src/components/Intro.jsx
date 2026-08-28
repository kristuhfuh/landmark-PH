import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useRevealOnScroll from '../hooks/useRevealOnScroll'
import FloralDecoration from './FloralDecoration'
import { useContent } from '../lib/content'

gsap.registerPlugin(SplitText, ScrollTrigger)

export default function Intro() {
  const ref = useRevealOnScroll({ stagger: 0.12 })
  const pillRef = useRef(null)
  const contentRef = useRef(null)
  const headingRef = useRef(null)
  const intro = useContent('intro')

  const eyebrow = intro.eyebrow || 'The Concept'
  const headingText =
    intro.headingText ||
    'A waterfront quarter of Port Harcourt, reimagined as a single'
  const headingItalic = intro.headingItalic || 'destination.'
  const pillars = intro.pillars || []

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Vertical cylinder â†’ full-width rectangle. Starts as a tall narrow pill
      // that pokes up into the hero (via the section's negative top margin),
      // then widens and square-corners as the user scrolls into the section.
      gsap.set(pillRef.current, {
        width: '30%',
        height: '90vh',
        borderRadius: '9999px',
      })
      gsap.set(contentRef.current, { opacity: 0 })

      gsap.to(pillRef.current, {
        width: '100%',
        height: '110vh',
        borderRadius: '0px',
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 70%',
          end: 'top 5%',
          scrub: 0.6,
        },
      })

      gsap.to(contentRef.current, {
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 30%',
          end: 'top -10%',
          scrub: 0.6,
        },
      })

      const split = new SplitText(headingRef.current, { type: 'words' })
      gsap.fromTo(
        split.words,
        { opacity: 0.15, y: 10 },
        {
          opacity: 1,
          y: 0,
          ease: 'none',
          stagger: 0.03,
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 85%',
            end: 'top 45%',
            scrub: true,
          },
        }
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="the-concept"
      ref={ref}
      className="relative -mt-[35vh] pt-0 pb-0 overflow-hidden"
    >
      <div className="relative flex items-start justify-center min-h-[130vh]">
        {/* Sand backdrop behind the pill's lower portion so, once expanded,
            it hands off cleanly into the sand-coloured flagship section. */}
        <div className="absolute inset-x-0 bottom-0 h-[45vh] bg-sand -z-10 pointer-events-none" />
        <div
          ref={pillRef}
          className="relative bg-sand overflow-hidden" /*shadow-2xl shadow-ink/40?*/
        >
          {/* Floral corner ornaments — bougainvillea-style cluster + palm fronds. */}
          <FloralDecoration position="top-left" size="md" />
          <FloralDecoration position="bottom-right" size="md" />

          <div
            ref={contentRef}
            className="h-full flex flex-col justify-center py-20 md:py-28 px-6 md:px-10 relative z-10"
          >
            <div className="max-w-5xl mx-auto text-center mb-16 md:mb-20">
              <p className="reveal inline-flex items-center gap-4 text-orange-dark text-xs tracking-widest2 uppercase mb-8">
                <span className="font-display italic text-orange-dark/90 text-base tabular-nums">01</span>
                <span aria-hidden="true" className="h-px w-8 bg-orange-dark/50" />
                {eyebrow}
              </p>
              <h2
                ref={headingRef}
                className="font-display text-3xl md:text-5xl leading-tight text-ink"
              >
                {headingText}
                <span className="italic text-marine"> {headingItalic}</span>
              </h2>
            </div>

            {/* Editorial pillar layout — numbered, staggered, varied widths.
                Reads as a curated set of principles rather than an even grid. */}
            <div className="max-w-6xl mx-auto w-full">
              <div className="grid md:grid-cols-12 md:gap-y-24 gap-y-14">
                {pillars.map((p, i) => {
                  const layouts = [
                    'md:col-span-7 md:col-start-1',
                    'md:col-span-5 md:col-start-8 md:mt-16',
                    'md:col-span-6 md:col-start-4',
                  ]
                  const isLead = i === 0
                  return (
                    <article
                      key={p.title}
                      className={`reveal ${layouts[i] || 'md:col-span-6'}`}
                    >
                      <div className="flex items-baseline gap-4 mb-4">
                        <span className="font-display italic text-orange-dark text-sm tabular-nums">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="h-px flex-1 bg-ink/15" />
                      </div>
                      <h3
                        className={`font-display text-marine mb-3 leading-tight ${
                          isLead ? 'text-3xl md:text-5xl' : 'text-2xl md:text-3xl'
                        }`}
                      >
                        {p.title}
                      </h3>
                      <p
                        className={`text-ink/70 leading-relaxed ${
                          isLead ? 'text-base md:text-lg max-w-lg' : 'text-sm md:text-base max-w-md'
                        }`}
                      >
                        {p.body}
                      </p>
                    </article>
                  )
                })}
              </div>
            </div>

            {/* Bridging beat — a small "up next" caption that hints at the
                Flagship section below and prevents the pillar block from
                dead-ending into whitespace. */}
            <div className="reveal max-w-6xl mx-auto w-full mt-20 md:mt-28 pt-8 border-t border-ink/15 flex flex-wrap items-baseline justify-between gap-4">
              <p className="text-orange-dark text-[11px] tracking-widest2 uppercase">
                Next · The Signature Attraction
              </p>
              <a
                href="#the-flagship"
                className="group inline-flex items-baseline gap-3 font-display italic text-marine text-xl md:text-2xl hover:text-orange-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-dark"
              >
                Read on
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform duration-300 group-hover:translate-x-1 not-italic"
                >
                  →
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
