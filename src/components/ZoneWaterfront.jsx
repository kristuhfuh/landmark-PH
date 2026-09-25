import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { Waves } from 'lucide-react'
import { parallaxLayer } from '../lib/animations'
import DragGallery from './DragGallery'
import useTilt from '../hooks/useTilt'
import useRevealOnScroll from '../hooks/useRevealOnScroll'
import SplitHeading from './SplitHeading'
import RevealImage from './RevealImage'
import Media from './Media'
import { openBookingModal } from './BookingModal'
import { useContent } from '../lib/content'

export default function ZoneWaterfront() {
  const ref = useRevealOnScroll({ stagger: 0.08 })
  const beachImgRef = useRef(null)
  const asideImgRef = useRef(null)
  const tiltRef = useTilt({ max: 6, scale: 1.015 })
  const waterfront = useContent('waterfront')

  const zoneLabel = waterfront.zoneLabel || 'Zone Three'
  const title = waterfront.title || 'The Waterfront'
  const intro =
    waterfront.intro ||
    'The full beach club complex, its lounges, and open water — set apart from the ring, reached along its own approach from the water body.'
  const features = waterfront.features || []
  const callout = waterfront.callout || ''
  const gallery = waterfront.gallery || []
  const stats = waterfront.stats || [
    { label: 'Beach club', value: '3,734 sqm' },
    { label: 'Lounges', value: 'Two (day & night)' },
    { label: 'Pool decks', value: 'Adult · Kids' },
    { label: 'Service', value: 'Kitchen · Spa · Bar' },
  ]
  const heroImage =
    waterfront.heroImage ||
    'https://images.unsplash.com/photo-1500815845799-7748ca339f27?auto=format&fit=crop&w=1600&q=80'
  const asideImage =
    waterfront.asideImage ||
    'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80'
  const dayPassLabel = waterfront.dayPassLabel || 'Reserve a day pass'

  useEffect(() => {
    const ctx = gsap.context(() => {
      parallaxLayer(beachImgRef.current, ref, { yPercent: 12, scrub: 0.6 })
      if (asideImgRef.current) {
        parallaxLayer(asideImgRef.current, ref, { yPercent: -14, scrub: 0.6 })
      }
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="the-waterfront" ref={ref} className="bg-sand text-ink py-24 md:py-32">
      {/* Top block: copy on the left, layered photo cluster on the right.
          The cluster is one large hero photo with a smaller offset image
          floating behind — both parallax on opposite axes so the composition
          feels three-dimensional as you scroll past. */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 grid md:grid-cols-12 gap-10 md:gap-14 items-start mb-20 md:mb-28">
        <div className="md:col-span-5 order-2 md:order-1">
          <p className="reveal text-orange-dark text-xs tracking-widest2 uppercase mb-4">
            {zoneLabel}
          </p>
          <SplitHeading className="font-display text-4xl md:text-5xl lg:text-6xl mb-6 leading-[1.02]">
            {title}
          </SplitHeading>
          <p className="reveal text-ink/70 leading-relaxed mb-10 max-w-md">
            {intro}
          </p>

          <dl className="reveal grid grid-cols-2 gap-x-6 gap-y-6 mb-10 max-w-md border-t border-ink/20 pt-8">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="text-orange-dark/80 text-[10px] tracking-widest2 uppercase mb-1.5">
                  {s.label}
                </dt>
                <dd className="font-display italic text-marine text-lg md:text-xl leading-tight">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>

          <button
            type="button"
            onClick={() => openBookingModal('table')}
            className="reveal inline-flex items-center gap-3 bg-orange-dark text-sand px-7 py-3.5 text-xs tracking-widest2 uppercase hover:bg-orange transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-dark"
          >
            {dayPassLabel}
            <span aria-hidden="true">→</span>
          </button>
        </div>

        {/* Photo cluster */}
        <div className="md:col-span-7 order-1 md:order-2 relative min-h-[26rem] md:min-h-[38rem]">
          <RevealImage
            direction="right"
            className="reveal relative h-80 md:h-[36rem] md:ml-16"
          >
            <div ref={beachImgRef} className="absolute -inset-[8%]">
              <Media
                src={heroImage}
                alt="Beach club pool overlooking the ocean"
                className="h-full w-full object-cover"
              />
            </div>
          </RevealImage>
          {/* Aside photo — small offset panel, negative-left so it visually
              sits under the main image's lower-left corner. Hidden on mobile
              to keep the stack tidy. */}
          <div className="hidden md:block absolute -left-4 -bottom-12 w-56 h-72 overflow-hidden shadow-2xl shadow-marine-dark/30">
            <div ref={asideImgRef} className="absolute -inset-[10%]">
              <Media
                src={asideImage}
                alt="Cabana along the beach approach"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Feature list — full-width band with editorial numbering. Sits
          between the intro and the callout as a "what's inside" beat. */}
      {features.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 md:px-10 mb-24">
          <p className="reveal text-orange-dark text-xs tracking-widest2 uppercase mb-6">
            What's inside the beach club
          </p>
          <ul className="grid md:grid-cols-3 gap-x-10 gap-y-8">
            {features.map((f, i) => (
              <li key={i} className="reveal border-t border-ink/15 pt-5">
                <span className="block font-display italic text-orange-dark text-sm tabular-nums mb-2">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="text-ink/75 text-sm md:text-base leading-relaxed">
                  {f}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Floatable Obstacle Course — no photo exists yet, honest icon treatment
          but now with a clearer CTA anchor. */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 mb-24">
        <div
          ref={tiltRef}
          className="reveal bg-white border border-marine-dark/15 p-8 md:p-12 shadow-sm grid md:grid-cols-12 gap-6 md:gap-10 items-center"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="md:col-span-1 flex md:justify-start">
            <Waves size={36} className="text-orange-dark" strokeWidth={1.5} />
          </div>
          <div className="md:col-span-8">
            <p className="text-orange-dark text-[11px] tracking-widest2 uppercase mb-3">
              On the water
            </p>
            <h4 className="font-display text-2xl md:text-3xl mb-3 leading-tight">
              Floatable Obstacle Course
            </h4>
            <p className="text-ink/65 text-sm md:text-base leading-relaxed max-w-2xl whitespace-pre-line">
              {callout}
            </p>
          </div>
          <div className="md:col-span-3 flex md:justify-end">
            <button
              type="button"
              onClick={() => openBookingModal('group')}
              className="inline-flex items-center gap-3 border border-orange-dark text-orange-dark px-5 py-3 text-xs tracking-widest2 uppercase hover:bg-orange-dark hover:text-sand transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-dark"
            >
              Book a heat
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Drag / snap-scroll gallery */}
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <p className="reveal text-orange-dark text-xs tracking-widest2 uppercase mb-2">
              Along the approach
            </p>
            <h3 className="reveal font-display text-2xl md:text-3xl leading-tight">
              Drag to explore.
            </h3>
          </div>
          <p className="reveal text-ink/55 text-xs tracking-widest2 uppercase max-w-xs text-right">
            Deck, jetty, cabanas — pulled from the beach-side approach.
          </p>
        </div>
        <div className="reveal">
          <DragGallery items={gallery} />
        </div>
      </div>
    </section>
  )
}
