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
  const archRef = useRef(null)
  const intro = useContent('intro')

  const eyebrow = intro.eyebrow || 'The Concept'
  const headingText =
    intro.headingText ||
    'A waterfront quarter of Port Harcourt, reimagined as a single'
  const headingItalic = intro.headingItalic || 'destination.'
  const pillars = intro.pillars || []

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Big-worm morph. The head (top) stays a perfect semicircle at every
      // width — top corners' radii sit at 9999px permanently so CSS
      // auto-clamps them to half the width. The animation happens over a
      // short scroll range at the start of the section: the worm rapidly
      // widens from a narrow tail to full screen width (front-loaded
      // easing so the "top" expands fast + sides slap against the viewport
      // edges early). After that the reader scrolls naturally through the
      // 200vh-tall worm body, which reads as the worm crawling up the page.
      gsap.set(pillRef.current, {
        width: '22%',
        height: '105vh',
        borderTopLeftRadius: '9999px',
        borderTopRightRadius: '9999px',
        borderBottomLeftRadius: '9999px',
        borderBottomRightRadius: '9999px',
      })
      gsap.set(contentRef.current, { opacity: 0 })
      if (archRef.current) gsap.set(archRef.current, { opacity: 0 })

      gsap.to(pillRef.current, {
        width: '100%',
        height: '200vh',
        borderBottomLeftRadius: '0px',
        borderBottomRightRadius: '0px',
        ease: 'power2.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%',
          end: 'top 25%',
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      })

      if (archRef.current) {
        gsap.to(archRef.current, {
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 65%',
            end: 'top 30%',
            scrub: 0.6,
          },
        })
      }

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
      <div className="relative flex items-start justify-center min-h-[200vh]">
        {/* Sand backdrop behind the pill's lower portion so, once expanded,
            it hands off cleanly into the sand-coloured flagship section. */}
        <div className="absolute inset-x-0 bottom-0 h-[45vh] bg-sand -z-10 pointer-events-none" />
        <div
          ref={pillRef}
          className="relative bg-sand overflow-hidden" /*shadow-2xl shadow-ink/40?*/
        >
          {/* Curved header text — follows the worm's semicircular head. The
              SVG is narrower than the pill and nudged down from the very
              top so its rectangle stays INSIDE the pill's rounded top
              (which otherwise clips its corners via overflow-hidden). */}
          <svg
            ref={archRef}
            className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-20"
            viewBox="0 0 400 110"
            preserveAspectRatio="none"
            style={{
              top: 'clamp(3rem, 10vh, 10rem)',
              width: 'min(55%, 900px)',
              height: 'clamp(5rem, 12vh, 12rem)',
            }}
            aria-hidden="true"
          >
            <defs>
              <path
                id="worm-arch-path"
                d="M 20 95 Q 200 15 380 95"
                fill="none"
              />
            </defs>
            <text
              className="font-display"
              fontSize="18"
              letterSpacing="6"
              fill="rgb(var(--c-orange-dark))"
              textAnchor="middle"
              style={{ textTransform: 'uppercase' }}
            >
              <textPath href="#worm-arch-path" startOffset="50%">
                A New Waterfront Quarter · Reimagined From The Shore Up
              </textPath>
            </text>
          </svg>

          {/* Floral corner ornaments — bougainvillea-style cluster + palm fronds. */}
          <FloralDecoration position="top-left" size="md" />
          <FloralDecoration position="bottom-right" size="md" />

          <div
            ref={contentRef}
            className="h-full flex flex-col justify-center pt-[42vh] md:pt-[48vh] pb-20 md:pb-28 px-6 md:px-10 relative z-10"
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
