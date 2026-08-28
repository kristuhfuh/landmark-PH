import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useRevealOnScroll from '../hooks/useRevealOnScroll'
import SplitHeading from './SplitHeading'
import { openBookingModal } from './BookingModal'

gsap.registerPlugin(ScrollTrigger)

/**
 * Rooms / stays showcase. Left column: a big vertical stack of room cards.
 * Right column: the "active" room's photo pinned in place, cross-fading as
 * you scroll through the list. Era-style "index + hero photo" split.
 *
 * Props:
 *   eyebrow, heading, italic, body
 *   rooms: [{ name, tag, size, guests, priceFrom, body, imageUrl, features[] }]
 */
export default function RoomsShowcase({
  eyebrow = 'Where you stay',
  heading = 'Rooms held close to the',
  italic = 'water.',
  body,
  rooms = [],
}) {
  const ref = useRevealOnScroll({ stagger: 0.08 })
  const [activeIndex, setActiveIndex] = useState(0)
  const cardRefs = useRef([])
  const imageStackRef = useRef(null)

  cardRefs.current = []
  const registerCard = (el) => {
    if (el && !cardRefs.current.includes(el)) cardRefs.current.push(el)
  }

  useEffect(() => {
    if (!cardRefs.current.length) return
    const ctx = gsap.context(() => {
      // Fire "activate card i" on both downscroll (onEnter) and upscroll
      // (onEnterBack) so the sticky photo always reflects the card currently
      // sitting near the middle of the viewport — never lags a step behind.
      cardRefs.current.forEach((card, i) => {
        ScrollTrigger.create({
          trigger: card,
          start: 'top 60%',
          end: 'bottom 40%',
          onEnter: () => setActiveIndex(i),
          onEnterBack: () => setActiveIndex(i),
        })
      })
    }, ref)
    return () => ctx.revert()
  }, [rooms.length])

  useEffect(() => {
    if (!imageStackRef.current) return
    const layers = imageStackRef.current.querySelectorAll('[data-room-layer]')
    layers.forEach((layer, i) => {
      const isActive = i === activeIndex
      // Incoming layer sits above the rest during the crossfade, so it
      // appears to wipe on cleanly instead of two layers dissolving through
      // each other at the same z-index.
      gsap.to(layer, {
        opacity: isActive ? 1 : 0,
        scale: isActive ? 1 : 1.08,
        duration: isActive ? 1.1 : 0.7,
        ease: 'power3.out',
        overwrite: 'auto',
        onStart: () => {
          if (isActive) layer.style.zIndex = '2'
        },
        onComplete: () => {
          if (!isActive) layer.style.zIndex = '1'
        },
      })
    })
  }, [activeIndex])

  return (
    <section
      id="rooms"
      ref={ref}
      className="relative bg-marine-dark text-sand py-24 md:py-36 px-6 md:px-10"
    >
      <div className="max-w-6xl mx-auto mb-16 md:mb-24">
        <p className="reveal text-orange-light text-xs tracking-widest2 uppercase mb-4">
          {eyebrow}
        </p>
        <SplitHeading className="font-display text-4xl md:text-6xl leading-[1.02] max-w-4xl">
          {heading}
          <span className="italic text-orange-light"> {italic}</span>
        </SplitHeading>
        {body && (
          <p className="reveal text-sand/70 mt-6 max-w-xl leading-relaxed">
            {body}
          </p>
        )}
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-10 md:gap-14">
        {/* Left: room list */}
        <ol className="md:col-span-7 space-y-10 md:space-y-24">
          {rooms.map((room, i) => (
            <li
              key={room.name}
              ref={registerCard}
              className={`reveal border-t border-sand/15 pt-8 md:pt-12 transition-colors duration-500 ${
                i === activeIndex ? 'text-sand' : 'text-sand/55'
              }`}
            >
              <div className="flex items-baseline gap-4 mb-4">
                <span className="font-display italic text-orange-light text-sm tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-xs tracking-widest2 uppercase text-orange-light/80">
                  {room.tag}
                </span>
              </div>
              <h3 className="font-display text-3xl md:text-5xl leading-tight mb-4">
                {room.name}
              </h3>
              {/* Mobile-only inline photo */}
              <img
                src={room.imageUrl}
                alt={room.name}
                className="md:hidden w-full h-64 object-cover mb-4"
              />
              <p className="leading-relaxed text-current/80 max-w-md mb-6">
                {room.body}
              </p>
              <dl className="grid grid-cols-3 gap-4 text-sm max-w-sm mb-6">
                <div>
                  <dt className="text-[10px] tracking-widest2 uppercase text-orange-light/70 mb-1">Size</dt>
                  <dd className="font-display italic text-base">{room.size}</dd>
                </div>
                <div>
                  <dt className="text-[10px] tracking-widest2 uppercase text-orange-light/70 mb-1">Guests</dt>
                  <dd className="font-display italic text-base">{room.guests}</dd>
                </div>
                <div>
                  <dt className="text-[10px] tracking-widest2 uppercase text-orange-light/70 mb-1">From</dt>
                  <dd className="font-display italic text-base">{room.priceFrom}</dd>
                </div>
              </dl>
              {room.features?.length > 0 && (
                <ul className="flex flex-wrap gap-2 mb-6">
                  {room.features.map((f) => (
                    <li
                      key={f}
                      className="text-[11px] tracking-widest2 uppercase text-sand/75 border border-sand/25 px-3 py-1"
                    >
                      {f}
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => openBookingModal('rooms')}
                  className="text-sand text-xs tracking-widest2 uppercase px-6 py-3 bg-orange-dark hover:bg-orange transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand"
                >
                  Reserve
                </button>
                <a
                  href="#visit"
                  className="text-sand/80 text-xs tracking-widest2 uppercase px-6 py-3 border border-sand/30 hover:border-orange-light hover:text-orange-light transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-light"
                >
                  View room
                </a>
              </div>
            </li>
          ))}
        </ol>

        {/* Right: sticky photo stack (hidden below md — mobile shows inline) */}
        <div className="hidden md:block md:col-span-5">
          <div className="sticky top-24">
            <div
              ref={imageStackRef}
              className="relative aspect-[3/4] w-full overflow-hidden"
            >
              {rooms.map((room, i) => (
                <img
                  key={room.name}
                  data-room-layer
                  src={room.imageUrl}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                />
              ))}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-sand text-xs tracking-widest2 uppercase flex items-center justify-between">
                <span>{rooms[activeIndex]?.name}</span>
                <span className="tabular-nums">
                  {String(activeIndex + 1).padStart(2, '0')} / {String(rooms.length).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
