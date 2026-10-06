import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useRevealOnScroll from '../hooks/useRevealOnScroll'
import SplitHeading from './SplitHeading'
import Media from './Media'
import { openBookingModal } from './BookingModal'

gsap.registerPlugin(ScrollTrigger)

/**
 * Rooms / stays showcase. Left column: a big vertical stack of room cards.
 * Right column: the "active" room's photo pinned in place, cross-fading as
 * you scroll through the list. Era-style "index + hero photo" split.
 *
 * Props:
 *   eyebrow, heading, italic, body
 *   rooms: [{ name, tag, guests, priceFrom, body, imageUrl, features[] }]
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
      className="relative z-20 bg-sky text-marine-dark py-24 md:py-36 px-6 md:px-10 overflow-clip"
    >
      {/* Subtle cultural line pattern — adinkra-inspired nested arcs,
          chevrons and dot grids rendered as a tiling SVG. Sand strokes at
          low alpha keep it ambient against the marine-dark bg. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(
            `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'>
              <g fill='none' stroke='%23000529' stroke-width='1'>
                <circle cx='40' cy='40' r='22'/>
                <circle cx='40' cy='40' r='14'/>
                <circle cx='40' cy='40' r='6'/>
                <path d='M100 20 L140 60 M100 60 L140 20'/>
                <path d='M100 90 L120 70 L140 90 L120 110 Z'/>
                <circle cx='120' cy='140' r='3'/>
                <circle cx='100' cy='140' r='3'/>
                <circle cx='140' cy='140' r='3'/>
                <path d='M10 100 Q 40 80 70 100 T 130 100'/>
                <path d='M10 120 Q 40 100 70 120 T 130 120'/>
                <path d='M0 160 L30 130 M30 160 L60 130'/>
              </g>
            </svg>`
          )}")`,
          backgroundSize: '220px 220px',
          backgroundRepeat: 'repeat',
        }}
      />

      <div className="relative max-w-6xl mx-auto mb-16 md:mb-24">
        <p className="reveal text-orange-dark text-xs tracking-widest2 uppercase mb-4">
          {eyebrow}
        </p>
        <SplitHeading className="font-display text-4xl md:text-6xl leading-[1.02] max-w-4xl">
          {heading}
          <span className="text-orange-dark"> {italic}</span>
        </SplitHeading>
        {body && (
          <p className="reveal text-marine/80 mt-6 max-w-xl leading-relaxed">
            {body}
          </p>
        )}
      </div>

      <div className="relative max-w-6xl mx-auto grid md:grid-cols-12 gap-10 md:gap-14">
        {/* Left: room list */}
        <ol className="md:col-span-7 space-y-10 md:space-y-24">
          {rooms.map((room, i) => (
            <li
              key={room.name}
              ref={registerCard}
              className={`reveal border-t border-marine-dark/15 pt-8 md:pt-12 transition-colors duration-500 ${
                i === activeIndex ? 'text-marine-dark' : 'text-marine-dark/80'
              }`}
            >
              <div className="flex items-baseline gap-4 mb-4">
                <span className="font-display text-orange-dark text-sm tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-xs tracking-widest2 uppercase text-orange-dark/80">
                  {room.tag}
                </span>
              </div>
              <h3 className="font-display text-3xl md:text-5xl leading-tight mb-4">
                {room.name}
              </h3>
              {/* Mobile-only inline photo/video */}
              <Media
                src={room.imageUrl}
                alt={room.name}
                className="md:hidden w-full h-64 rounded-2xl object-cover mb-5"
              />
              <p className="leading-relaxed text-marine-dark/75 max-w-md mb-6">
                {room.body}
              </p>
              <dl className="grid grid-cols-2 gap-6 text-sm max-w-sm mb-6">
                <div>
                  <dt className="text-[10px] tracking-widest2 uppercase text-orange-dark/70 mb-1">Guests</dt>
                  <dd className="font-display text-base">{room.guests}</dd>
                </div>
                <div>
                  <dt className="text-[10px] tracking-widest2 uppercase text-orange-dark/70 mb-1">From</dt>
                  <dd className="font-display text-base">{room.priceFrom}</dd>
                </div>
              </dl>
              {/* App-discount nudge — Citizen app members save 10%. */}
              <p className="inline-flex items-center gap-1.5 text-[10px] tracking-widest2 uppercase text-orange-dark mb-6">
                <span aria-hidden="true">↓</span>
                10% cheaper on the Citizen app
              </p>
              {room.features?.length > 0 && (
                <ul className="flex flex-wrap gap-2 mb-6">
                  {room.features.map((f) => (
                    <li
                      key={f}
                      className="text-[11px] tracking-widest2 uppercase text-marine-dark/75 border border-marine-dark/25 rounded-full px-3 py-1"
                    >
                      {f}
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => openBookingModal('rooms')}
                  className="min-h-11 text-sand text-xs tracking-widest2 uppercase px-6 py-3 rounded-full bg-marine hover:bg-marine-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marine"
                >
                  Reserve Room
                </button>
                <a
                  href="/bookings/rooms"
                  className="min-h-11 inline-flex items-center text-marine text-xs tracking-widest2 uppercase px-6 py-3 rounded-full border border-marine/40 hover:bg-marine hover:text-sand transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marine"
                >
                  View room
                </a>
              </div>
            </li>
          ))}
          <li className="pt-10 border-t border-marine-dark/15">
            <a
              href="/rooms"
              className="group inline-flex items-baseline gap-3 font-display text-marine text-xl md:text-2xl hover:text-orange-dark transition-colors"
            >
              View all rooms
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          </li>
        </ol>

        {/* Right: sticky photo stack (hidden below md — mobile shows inline) */}
        <div className="hidden md:block md:col-span-5">
          <div className="sticky top-24">
            <div
              ref={imageStackRef}
              className="relative aspect-[3/4] w-full overflow-hidden rounded-[16px] shadow-[0_20px_50px_-20px_rgba(0,5,41,0.25)]"
            >
              {rooms.map((room, i) => (
                <Media
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
