import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Sparkles,
  Gamepad2,
  Baby,
  Disc3,
  UtensilsCrossed,
  Car,
  Mountain,
  Trophy,
  Target,
  Waves,
  Dot,
} from 'lucide-react'
import useRevealOnScroll from '../hooks/useRevealOnScroll'
import SplitHeading from './SplitHeading'
import CountUp from './CountUp'
import Media from './Media'
import { useContent } from '../lib/content'

gsap.registerPlugin(ScrollTrigger)

const ICON_MAP = {
  Sparkles,
  Gamepad2,
  Baby,
  Disc3,
  UtensilsCrossed,
  Car,
  Mountain,
  Trophy,
  Target,
  Waves,
}

const SLIDE_INTERVAL_MS = 5000

export default function ZoneRing() {
  const introRef = useRevealOnScroll({ stagger: 0.1 })
  const pinRef = useRef(null)
  const layerRefs = useRef([])
  const prevActiveRef = useRef(-1)
  const [active, setActive] = useState(0)
  const ring = useContent('ring')

  const zoneLabel = ring.zoneLabel || 'Zone One'
  const title = ring.title || 'The Ring'
  const intro =
    ring.intro ||
    'A circular attraction floor at the centre of the grounds. Scroll to move through it — six spaces arranged around a single walking loop.'
  const ITEMS = ring.items || []
  layerRefs.current = layerRefs.current.slice(0, ITEMS.length)

  // Auto-advance slideshow. Uses setTimeout keyed off `active` so any
  // change to active (interval OR user click) restarts the 5s countdown.
  useEffect(() => {
    if (!ITEMS.length) return
    const t = setTimeout(() => {
      setActive((a) => (a + 1) % ITEMS.length)
    }, SLIDE_INTERVAL_MS)
    return () => clearTimeout(t)
  }, [active, ITEMS.length])

  // Push transition when `active` changes. The incoming layer still runs
  // the staggered clip-path wipe (top corner leads, bottom trails), while
  // the previous layer physically slides out to the left — so it reads as
  // the new item pushing the old one off screen. Both motions share the
  // same duration + ease so they move together.
  useEffect(() => {
    const prev = prevActiveRef.current
    const activeEl = layerRefs.current[active]
    if (!activeEl) return

    const duration = 0.9
    const ease = 'power2.inOut'

    layerRefs.current.forEach((layer, i) => {
      if (!layer) return
      if (i === active) {
        // Incoming: on top, at rest position, ready for the wipe reveal.
        gsap.set(layer, {
          zIndex: 2,
          x: '0%',
          '--layer-top-x': '0%',
          '--layer-bot-x': '0%',
        })
      } else if (i === prev) {
        // Outgoing: behind, fully visible, at rest position. About to be
        // pushed left.
        gsap.set(layer, {
          zIndex: 1,
          x: '0%',
          '--layer-top-x': '100%',
          '--layer-bot-x': '100%',
        })
      } else {
        // Everything else: parked offscreen.
        gsap.set(layer, {
          zIndex: 0,
          x: '0%',
          '--layer-top-x': '0%',
          '--layer-bot-x': '0%',
        })
      }
    })

    // Incoming — staggered clip-path wipe.
    gsap.to(activeEl, {
      '--layer-top-x': '100%',
      duration: 0.5,
      ease,
    })
    gsap.to(activeEl, {
      '--layer-bot-x': '100%',
      duration,
      ease,
    })

    // Outgoing — physical push to the left. Same duration as the wipe so
    // both motions land together.
    if (prev !== -1 && prev !== active) {
      const prevEl = layerRefs.current[prev]
      if (prevEl) {
        gsap.to(prevEl, {
          x: '-100%',
          duration,
          ease,
        })
      }
    }

    prevActiveRef.current = active
  }, [active])

  const current = ITEMS[active] || {}
  const ActiveIcon = ICON_MAP[current.icon] || Dot

  return (
    <section id="the-ring">
      {/* Mobile: title + zone label, then plain stacked cards. */}
      <div className="md:hidden bg-sand text-ink px-6 pt-24 pb-10 text-center">
        <p className="text-orange-dark text-xs tracking-widest2 uppercase mb-4">
          {zoneLabel}
        </p>
        <h2 className="font-display text-5xl leading-none tracking-tight mb-4 text-marine">
          {title}
        </h2>
        <p className="text-ink/70 leading-relaxed max-w-md mx-auto">{intro}</p>
      </div>
      <div className="md:hidden bg-sand text-ink">
        {ITEMS.map((item, i) => {
          const Icon = ICON_MAP[item.icon] || Dot
          return (
            <article
              key={item.title || i}
              className="relative h-[85vh] w-full overflow-hidden"
            >
              {item.imageUrl ? (
                <Media
                  src={item.imageUrl}
                  alt={item.title || ''}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-sand" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/10" />
              <div className="relative z-10 h-full flex flex-col justify-end p-6 pb-10 text-sand">
                <Icon size={26} className="text-orange-light mb-4" strokeWidth={1.5} />
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-orange-light text-xs tracking-widest2 uppercase">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <CountUp value={item.area} className="text-sand/70 text-xs" />
                </div>
                <h3 className="font-display text-3xl mb-3">{item.title}</h3>
                <p className="text-sand/85 text-sm leading-relaxed max-w-md">
                  {item.body}
                </p>
              </div>
            </article>
          )
        })}
      </div>

      {/* Tablet+: intro block (normal, editorial title) followed by the
          pinned auto-advancing slideshow. */}
      <div
        ref={introRef}
        className="hidden md:block bg-sand text-ink pt-24 md:pt-32 pb-16 px-6 md:px-10"
      >
        <div className="max-w-3xl mx-auto text-center">
          <p className="reveal text-orange-dark text-xs tracking-widest2 uppercase mb-4">
            {zoneLabel}
          </p>
          <SplitHeading className="font-display text-4xl md:text-6xl mb-5">
            {title}
          </SplitHeading>
          <p className="reveal text-ink/70 leading-relaxed">{intro}</p>
          <p className="reveal text-orange-dark text-xs tracking-widest2 uppercase mt-8 animate-pulse">
            Keep scrolling ↓
          </p>
        </div>
      </div>

      {/* Pinned slideshow — 150vh gives the reader time to sit with the
          auto-advancing composition before releasing to the next section. */}
      <div
        ref={pinRef}
        className="hidden md:block relative w-full"
        style={{ height: `150vh` }}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-ink">
          {/* Background layers */}
          <div className="absolute inset-0">
            {ITEMS.map((item, i) => (
              <div
                key={item.title || i}
                ref={(el) => { layerRefs.current[i] = el }}
                className="ring-layer absolute inset-0"
              >
                {item.imageUrl ? (
                  <Media
                    src={item.imageUrl}
                    alt={item.title || ''}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-marine-dark" />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/40 to-ink/10" />
              </div>
            ))}
          </div>

          {/* Left-aligned menu — outlined text for inactive items, filled
              sand for the active one, small orange vertical mark. */}
          <nav
            className="absolute left-6 md:left-14 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-1"
            aria-label="Ring attractions"
          >
            {ITEMS.map((item, i) => {
              const isActive = active === i
              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-current={isActive ? 'true' : undefined}
                  className="group relative flex items-center gap-4 py-1.5 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-light !rounded-none"
                >
                  <span
                    aria-hidden="true"
                    className={`w-0.5 self-stretch transition-all duration-500 ${
                      isActive
                        ? 'bg-orange scale-y-100 opacity-100'
                        : 'bg-orange scale-y-0 opacity-0'
                    }`}
                    style={{ transformOrigin: 'center' }}
                  />
                  <span
                    className={`font-display uppercase leading-[0.95] tracking-tight transition-all duration-500 ${
                      isActive
                        ? 'text-sand'
                        : 'text-sand/40 group-hover:text-sand/70'
                    }`}
                    style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3.25rem)' }}
                  >
                    {item.title}
                  </span>
                </button>
              )
            })}
          </nav>

          {/* Right-aligned description card for the active item. */}
          <div className="absolute right-6 md:right-14 bottom-10 md:bottom-16 z-10 max-w-md text-sand">
            <div key={active} className="animate-[fadeIn_0.6s_ease-out]">
              <ActiveIcon size={28} className="text-orange-light mb-5" strokeWidth={1.5} />
              <div className="flex items-baseline gap-4 mb-3">
                <span className="text-orange-light text-xs tracking-widest2 uppercase">
                  {String(active + 1).padStart(2, '0')} / {String(ITEMS.length).padStart(2, '0')}
                </span>
                <CountUp value={current.area} className="text-sand/70 text-xs tracking-wide" />
              </div>
              <h3 className="font-display text-3xl md:text-4xl mb-4">{current.title}</h3>
              <p className="text-sand/85 text-sm md:text-base leading-relaxed">
                {current.body}
              </p>
            </div>
          </div>

          {/* Corner label + progress bar */}
          <div className="absolute top-6 md:top-10 right-6 md:right-14 z-10 text-sand/60 text-[11px] tracking-widest2 uppercase">
            {title} — {zoneLabel}
          </div>
          <div className="absolute top-0 inset-x-0 z-10 h-0.5 bg-sand/10">
            <div
              className="h-full bg-orange-light transition-[width] duration-500 ease-out"
              style={{ width: `${((active + 1) / ITEMS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
