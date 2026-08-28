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

export default function ZoneRing() {
  const introRef = useRevealOnScroll({ stagger: 0.1 })
  const pinRef = useRef(null)
  const layersRef = useRef(null)
  const [active, setActive] = useState(0)
  const ring = useContent('ring')

  const zoneLabel = ring.zoneLabel || 'Zone One'
  const title = ring.title || 'The Ring'
  const intro =
    ring.intro ||
    'A circular attraction floor at the centre of the grounds. Scroll to move through it — six spaces arranged around a single walking loop.'
  const ITEMS = ring.items || []

  useEffect(() => {
    const count = ITEMS.length
    if (!count) return
    // Only run the pin-and-scrub behavior on tablet+. On phones the section
    // renders as a plain stacked card list (see JSX below).
    const mql = window.matchMedia('(min-width: 768px)')
    if (!mql.matches) return
    const st = ScrollTrigger.create({
      trigger: pinRef.current,
      start: 'top top',
      end: 'bottom bottom',
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const p = Math.min(self.progress, 0.9999)
        setActive(Math.floor(p * count))
      },
    })
    return () => st.kill()
  }, [ITEMS.length])

  // GSAP-driven crossfade with a slight scale settle on the incoming layer,
  // which reads as more expensive than a plain CSS opacity fade.
  useEffect(() => {
    if (!layersRef.current) return
    const layers = layersRef.current.querySelectorAll('[data-ring-layer]')
    layers.forEach((layer, i) => {
      const isActive = i === active
      gsap.to(layer, {
        opacity: isActive ? 1 : 0,
        scale: isActive ? 1 : 1.06,
        duration: isActive ? 0.9 : 0.55,
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
  }, [active])

  // Click a menu item → scroll to the exact position that corresponds to
  // that item's slice of the pinned range. Uses the pin container's own
  // top + fractional offset so it lands precisely on the item.
  function jumpTo(i) {
    if (!pinRef.current) return
    const rect = pinRef.current.getBoundingClientRect()
    const containerTop = window.scrollY + rect.top
    const containerHeight = pinRef.current.offsetHeight - window.innerHeight
    // Bias the target slightly past the item boundary so the ScrollTrigger
    // progress lands unambiguously inside the target slice.
    const target = containerTop + (i / ITEMS.length + 0.05 / ITEMS.length) * containerHeight
    window.scrollTo({ top: target, behavior: 'smooth' })
  }

  const current = ITEMS[active] || {}
  const ActiveIcon = ICON_MAP[current.icon] || Dot

  return (
    <section id="the-ring">
      <div
        ref={introRef}
        className="bg-sand text-ink pt-24 md:pt-32 pb-16 px-6 md:px-10"
      >
        <div className="max-w-3xl mx-auto text-center">
          <p className="reveal text-orange-dark text-xs tracking-widest2 uppercase mb-4">
            {zoneLabel}
          </p>
          <SplitHeading className="font-display text-4xl md:text-6xl mb-5">{title}</SplitHeading>
          <p className="reveal text-ink/70 leading-relaxed">{intro}</p>
          <p className="reveal hidden md:block text-orange-dark text-xs tracking-widest2 uppercase mt-8 animate-pulse">
            Keep scrolling ↓
          </p>
        </div>
      </div>

      {/* Mobile: plain stacked cards. Touch users get natural scrolling
          instead of a 6-viewport pin. */}
      <div className="md:hidden bg-sand text-ink">
        {ITEMS.map((item, i) => {
          const Icon = ICON_MAP[item.icon] || Dot
          return (
            <article
              key={item.title || i}
              className="relative h-[85vh] w-full overflow-hidden"
            >
              {item.imageUrl ? (
                <img
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

      {/* Tablet+: pinned reveal with vertical menu and full-bleed images. */}
      <div
        ref={pinRef}
        className="hidden md:block relative w-full"
        style={{ height: `${ITEMS.length * 100}vh` }}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-sand">
          {/* Background stack — GSAP crossfade with scale settle */}
          <div ref={layersRef} className="absolute inset-0">
            {ITEMS.map((item, i) => (
              <div
                key={item.title || i}
                data-ring-layer
                className="absolute inset-0 will-change-transform"
                style={{ opacity: i === 0 ? 1 : 0 }}
              >
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title || ''}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-sand" />
                )}
                <div className="absolute inset-0 bg-gradient-to-l from-ink/75 via-ink/40 to-ink/10" />
              </div>
            ))}
          </div>

          {/* Left-aligned vertical menu — clickable to jump */}
          <nav
            className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-4 md:gap-6"
            aria-label="Ring attractions"
          >
            {ITEMS.map((item, i) => {
              const isActive = active === i
              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => jumpTo(i)}
                  aria-current={isActive ? 'true' : undefined}
                  className="group flex items-center gap-4 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-light"
                >
                  <span
                    className={`h-px transition-all duration-500 ${
                      isActive
                        ? 'w-10 bg-orange-light'
                        : 'w-4 bg-sand/40 group-hover:w-8 group-hover:bg-sand/70'
                    }`}
                  />
                  <span
                    className={`font-display transition-all duration-500 ${
                      isActive
                        ? 'text-sand text-2xl md:text-3xl'
                        : 'text-sand/70 text-lg md:text-xl group-hover:text-sand'
                    }`}
                  >
                    {item.title}
                  </span>
                </button>
              )
            })}
          </nav>

          {/* Right-aligned description card for the active item */}
          <div className="absolute right-6 md:right-12 bottom-10 md:bottom-16 z-10 max-w-md text-sand">
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

          {/* Corner label + progress bar. Progress bar sits along the top edge
              and tracks the pin range — a tiny wayfinding aid for a section
              that spans many viewports. */}
          <div className="absolute top-6 md:top-10 right-6 md:right-12 z-10 text-sand/60 text-[11px] tracking-widest2 uppercase">
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
