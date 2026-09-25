import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Media from './Media'
import { useContent } from '../lib/content'

gsap.registerPlugin(ScrollTrigger)

/**
 * Combined horizontal-scroll section that packs three editorial beats into
 * a single pinned experience:
 *   Panel 1 — Along the coast   (from `overlap` content)   ·  100vw
 *   Panel 2 — Grounds from Above (from `panorama` content) ·  300vw (long)
 *   Panel 3 — At the Table       (from `fnbMarketplace`)   ·  100vw
 *
 * Panel 2 is intentionally 3× wider so the user spends the same amount of
 * scroll on it as the standalone HorizontalPanorama used to take, with its
 * chapter callouts distributed across a long aerial photo.
 *
 * On mobile / reduced-motion the panels render as a normal vertical stack.
 */

const STATUS_STYLES = {
  Confirmed: 'bg-orange-dark text-sand',
  'In talks': 'border border-orange-dark/50 text-orange-dark',
  'Slot open': 'border border-ink/25 text-ink/60',
}

function inferStatus(v) {
  if (v.status) return v.status
  if (v.kind === 'Anchor' || /confirm(ed)?$/i.test(v.kind || '')) return 'Confirmed'
  if (/talks|discussion|shortlist/i.test((v.body || '') + (v.kind || ''))) return 'In talks'
  if (/to confirm|reserved|open|tba|tbd/i.test(v.name || '') || !v.name) return 'Slot open'
  return 'In talks'
}

export default function PinnedTrio() {
  const outerRef = useRef(null)
  const trackRef = useRef(null)
  const progressBarRef = useRef(null)
  const [activePanel, setActivePanel] = useState(0)

  const overlap = useContent('overlap')
  const panorama = useContent('panorama')
  const fnb = useContent('fnbMarketplace')

  const panels = useMemo(
    () => [
      { key: 'coast', label: overlap.eyebrow || 'Along the shore' },
      { key: 'above', label: panorama.eyebrow || 'From above' },
      { key: 'table', label: fnb.eyebrow || 'At the table' },
    ],
    [overlap.eyebrow, panorama.eyebrow, fnb.eyebrow]
  )

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(min-width: 768px)').matches) return

    const ctx = gsap.context(() => {
      const track = trackRef.current
      // Distance = full track width minus one viewport (last panel's right
      // edge lands at the viewport right edge on the final frame). Using
      // scrollWidth here accounts for variable panel widths.
      const distance = () => track.scrollWidth - window.innerWidth

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: outerRef.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            // Update the progress rail imperatively (no state, no
            // re-render — just a transform on the bar element).
            if (progressBarRef.current) {
              progressBarRef.current.style.transform = `scaleX(${self.progress})`
            }
          },
        },
      })

      // Mark active panel by watching which one's centre is closest to the
      // viewport centre. Uses the horizontal-tween's ScrollTrigger as the
      // container animation so per-panel triggers fire off scroll progress.
      gsap.utils.toArray('[data-trio-panel]', track).forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          containerAnimation: tween,
          start: 'left 60%',
          end: 'right 40%',
          onToggle: (self) => {
            if (self.isActive) setActivePanel(i)
          },
        })
      })

      // Per-element reveal animations. Each [data-trio-reveal] element
      // fades + translates in as it crosses the horizontal viewport. Uses
      // toggleActions instead of scrub so scrolling back and forth doesn't
      // jitter the animation, but leaving the element resets it.
      const initialForDirection = {
        up: { y: 40, opacity: 0 },
        down: { y: -40, opacity: 0 },
        left: { x: -60, opacity: 0 },
        right: { x: 60, opacity: 0 },
        scale: { scale: 0.92, opacity: 0 },
      }
      gsap.utils.toArray('[data-trio-reveal]', track).forEach((el) => {
        const dir = el.dataset.trioReveal || 'up'
        const delay = parseFloat(el.dataset.trioDelay || '0')
        const initial = initialForDirection[dir] || initialForDirection.up
        gsap.fromTo(
          el,
          initial,
          {
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 1.1,
            delay,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              containerAnimation: tween,
              start: 'left 85%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      })

      return () => tween.scrollTrigger && tween.scrollTrigger.kill()
    }, outerRef)
    return () => ctx.revert()
  }, [panels.length])

  return (
    <>
      {/* DESKTOP: pinned horizontal scroll through three panels */}
      <section
        ref={outerRef}
        className="hidden md:block relative h-screen w-full overflow-hidden"
      >
        {/* Top progress rail — width scales linearly across the full pinned
            range (not per-panel), so long panels take proportionally longer
            to fill. Driven imperatively from the pin's onUpdate. */}
        <div className="absolute top-0 inset-x-0 z-30 h-0.5 bg-ink/10">
          <div
            ref={progressBarRef}
            className="h-full bg-orange origin-left"
            style={{ transform: 'scaleX(0)' }}
            aria-hidden="true"
          />
        </div>

        {/* Horizontal track — panels sit side-by-side and each declares its
            own width via the shrink-0 class on its container. */}
        <div
          ref={trackRef}
          className="absolute inset-y-0 left-0 flex will-change-transform"
        >
          <CoastPanel overlap={overlap} />
          <AbovePanel panorama={panorama} />
          <TablePanel fnb={fnb} />
        </div>

        {/* Bottom panel indicator */}
        <div className="absolute bottom-6 md:bottom-8 inset-x-0 z-30 flex items-center justify-center gap-6 pointer-events-none">
          <span className="font-display italic text-orange text-xs tabular-nums">
            {String(activePanel + 1).padStart(2, '0')}
          </span>
          <div className="flex items-center gap-2">
            {panels.map((p, i) => (
              <span
                key={p.key}
                className={`h-1 transition-all duration-500 rounded-full ${
                  i === activePanel ? 'w-10 bg-orange' : 'w-3 bg-ink/25'
                }`}
                aria-hidden="true"
              />
            ))}
          </div>
          <span className="text-ink/60 text-xs tracking-widest2 uppercase tabular-nums">
            {panels[activePanel]?.label}
          </span>
        </div>
      </section>

      {/* MOBILE: normal vertical stack — pinned horizontal is bad on touch. */}
      <div className="md:hidden">
        <CoastPanel overlap={overlap} compact />
        <AbovePanel panorama={panorama} compact />
        <TablePanel fnb={fnb} compact />
      </div>
    </>
  )
}

/* ---------------- Panel 1: Along the coast (OverlapHeading style) ---------------- */
function CoastPanel({ overlap, compact }) {
  const eyebrow = overlap.eyebrow || 'From the shore'
  const topLine = overlap.topLine || 'Along the'
  const bottomLine = overlap.bottomLine || 'coast.'
  const imageUrl =
    overlap.imageUrl ||
    'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=2400&q=80'
  const imageAlt = overlap.imageAlt || ''
  const caption = overlap.caption
  const align = overlap.align || 'left'

  const height = compact ? 'min-h-[95vh]' : 'h-screen'
  const outer = compact ? 'w-full' : 'w-screen shrink-0'

  const photoAlign = align === 'right' ? 'md:ml-auto' : 'md:mr-auto'
  const topAlign =
    align === 'right' ? 'md:right-8 text-right' : 'md:left-8 text-left'
  const bottomAlign =
    align === 'right' ? 'md:left-8 text-left' : 'md:right-8 text-right'

  return (
    <section
      data-trio-panel
      className={`${outer} ${height} bg-sand text-ink relative overflow-hidden py-16 md:py-24 px-6 md:px-10 flex flex-col`}
    >
      {eyebrow && (
        <p
          data-trio-reveal="up"
          className="max-w-6xl w-full mx-auto text-orange-dark text-xs tracking-widest2 uppercase mb-8 md:mb-10 shrink-0 trio-anim"
        >
          01 · {eyebrow}
        </p>
      )}

      <div className="relative max-w-6xl w-full mx-auto flex-1">
        {/* Photo — portrait slab, half-width, aligned per `align` prop */}
        <div
          data-trio-reveal="scale"
          data-trio-delay="0.15"
          className={`relative w-full md:w-[62%] h-full max-h-[70vh] aspect-[4/5] overflow-hidden trio-anim ${photoAlign}`}
        >
          <Media src={imageUrl} alt={imageAlt} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-marine-dark/15 pointer-events-none" />
        </div>

        {/* Top line — overlaps the top edge of the photo */}
        <h2
          data-trio-reveal="left"
          data-trio-delay="0.3"
          className={`absolute z-10 top-2 md:top-4 left-4 trio-anim ${topAlign} font-display leading-[0.85] tracking-tight text-marine-dark`}
          style={{ fontSize: 'clamp(2.75rem, 9vw, 8rem)' }}
        >
          {topLine}
        </h2>

        {/* Bottom line — italic, overlaps the bottom-right */}
        <h2
          data-trio-reveal="right"
          data-trio-delay="0.45"
          className={`absolute z-10 bottom-6 md:bottom-10 right-4 trio-anim ${bottomAlign} font-display italic leading-[0.85] tracking-tight text-orange-dark`}
          style={{ fontSize: 'clamp(3rem, 11vw, 10rem)' }}
        >
          {bottomLine}
        </h2>

        {caption && (
          <p
            data-trio-reveal="up"
            data-trio-delay="0.6"
            className={`absolute bottom-0 max-w-sm text-ink/60 text-sm leading-relaxed trio-anim ${
              align === 'right' ? 'md:right-0' : 'md:left-0'
            }`}
          >
            {caption}
          </p>
        )}
      </div>
    </section>
  )
}

/* ---------------- Panel 2: Grounds from Above (extended-width) ---------------- */
function AbovePanel({ panorama, compact }) {
  const eyebrow = panorama.eyebrow || 'The Grounds · From Above'
  const heading = panorama.heading || 'A single loop, from ring to shore.'
  const imageUrl =
    panorama.imageUrl ||
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=3600&q=80'
  const imageAlt = panorama.imageAlt || ''
  const chapters = panorama.chapters || [
    { title: 'The Ring', body: 'Attractions at the centre.' },
    { title: 'The Green', body: 'Concert lawn and courts.' },
    { title: 'The Waterfront', body: 'Beach club, jetty, open water.' },
  ]

  const height = compact ? 'min-h-[85vh]' : 'h-screen'
  // Desktop: 3 viewports wide so scrolling through it takes 3× as long as
  // the flanking panels — matches the original HorizontalPanorama depth.
  const outer = compact ? 'w-full' : 'shrink-0 h-full'
  const desktopWidth = compact ? undefined : { width: 'max(300vw, 3200px)' }

  return (
    <section
      data-trio-panel
      className={`${outer} ${height} relative overflow-hidden bg-ink text-sand`}
      style={desktopWidth}
    >
      {/* Full-track aerial */}
      <Media
        src={imageUrl}
        alt={imageAlt}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgb(var(--c-ink) / 0.55) 0%, rgb(var(--c-ink) / 0.15) 40%, rgb(var(--c-ink) / 0.6) 100%)',
        }}
      />

      {/* Header pinned inside the panel's first viewport */}
      <div
        data-trio-reveal="up"
        className="absolute top-8 md:top-12 left-6 md:left-12 z-10 trio-anim"
      >
        <span className="text-orange-light text-xs tracking-widest2 uppercase">
          02 · {eyebrow}
        </span>
      </div>
      {heading && !compact && (
        <div
          data-trio-reveal="up"
          data-trio-delay="0.2"
          className="absolute left-6 md:left-12 bottom-24 md:bottom-32 z-10 max-w-xl trio-anim"
        >
          <h2
            className="font-display text-sand leading-[0.95]"
            style={{ fontSize: 'clamp(2.75rem, 6vw, 5.5rem)' }}
          >
            {heading}
          </h2>
        </div>
      )}
      {heading && compact && (
        <div className="absolute inset-x-6 bottom-16 z-10">
          <h2 className="font-display text-sand text-4xl leading-[0.95] mb-6">
            {heading}
          </h2>
        </div>
      )}

      {/* Chapter callouts spread across the wide track (desktop). On mobile
          we render them below the image as a vertical stack. */}
      {!compact && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          {chapters.map((c, i) => {
            const leftPct = 20 + (i * 60) / Math.max(chapters.length - 1, 1)
            const topOffsets = ['22%', '58%', '30%', '64%']
            const top = topOffsets[i % topOffsets.length]
            return (
              <div
                key={c.title}
                data-trio-reveal="up"
                className="absolute max-w-xs trio-anim"
                style={{ left: `${leftPct}%`, top }}
              >
                <span className="block font-display italic text-orange-light text-sm tabular-nums mb-2">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display text-2xl md:text-4xl leading-tight text-sand">
                  {c.title}
                </h3>
                {c.body && (
                  <p className="mt-2 text-sand/80 text-sm md:text-base leading-relaxed max-w-[22ch]">
                    {c.body}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}

      {compact && (
        <div className="relative z-10 pt-[85vh] pb-10 px-6">
          <ol className="space-y-8">
            {chapters.map((c, i) => (
              <li key={c.title} className="border-t border-sand/20 pt-5">
                <span className="block font-display italic text-orange-light text-sm tabular-nums mb-2">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display text-2xl leading-tight mb-2">
                  {c.title}
                </h3>
                {c.body && (
                  <p className="text-sand/80 text-sm leading-relaxed">{c.body}</p>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  )
}

/* ---------------- Panel 3: At the Table ---------------- */
function TablePanel({ fnb, compact }) {
  const eyebrow = fnb.eyebrow || 'At the Table'
  const heading = fnb.heading || 'A curated line-up,'
  const italic = fnb.headingItalic || 'not a food court.'
  const body =
    fnb.body ||
    'One seafood house is confirmed. The remaining vendor slots are held open — each will carry a single, distinct kitchen rather than a repeated format.'
  const vendors = fnb.vendors || []
  const imageUrl =
    fnb.imageUrl ||
    'https://images.unsplash.com/photo-1531419925964-8c2e4bc58e63?auto=format&fit=crop&w=1400&q=80'

  const height = compact ? 'min-h-[95vh]' : 'h-screen'
  const outer = compact ? 'w-full' : 'w-screen shrink-0'

  return (
    <section
      id="table"
      data-trio-panel
      className={`${outer} ${height} bg-sand text-ink relative overflow-hidden flex items-center`}
    >
      <div className="max-w-6xl mx-auto w-full px-6 md:px-12 grid md:grid-cols-12 gap-8 md:gap-14 items-center">
        <div className="md:col-span-5">
          <div
            data-trio-reveal="scale"
            className="relative w-full aspect-[4/5] overflow-hidden mb-6 shadow-2xl shadow-marine-dark/20 trio-anim"
          >
            <Media
              src={imageUrl}
              alt="White dining tables set outdoors"
              className="h-full w-full object-cover"
            />
          </div>
          <p
            data-trio-reveal="up"
            data-trio-delay="0.15"
            className="text-orange-dark text-xs tracking-widest2 uppercase mb-3 trio-anim"
          >
            03 · {eyebrow}
          </p>
          <h2
            data-trio-reveal="up"
            data-trio-delay="0.25"
            className="font-display text-3xl md:text-4xl mb-4 leading-tight trio-anim"
          >
            {heading} <span className="italic text-marine">{italic}</span>
          </h2>
          <p
            data-trio-reveal="up"
            data-trio-delay="0.35"
            className="text-ink/70 leading-relaxed text-sm max-w-md trio-anim"
          >
            {body}
          </p>
        </div>

        <ol className="md:col-span-7 space-y-4 max-h-[75vh] overflow-y-auto pr-2">
          {vendors.map((v, i) => {
            const status = inferStatus(v)
            const isOpen = status === 'Slot open'
            const name = isOpen ? 'Slot held open' : v.name
            return (
              <li
                key={i}
                data-trio-reveal="left"
                data-trio-delay={`${0.3 + i * 0.1}`}
                className="border-t border-ink/15 pt-4 trio-anim"
              >
                <div className="flex items-baseline gap-5 md:gap-8">
                  <span className="font-display italic text-orange-dark text-sm tabular-nums pt-1 w-8 shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-baseline justify-between gap-3 mb-1">
                      <h3
                        className={`font-display text-xl md:text-2xl leading-tight ${
                          isOpen ? 'italic text-ink/50' : 'text-ink'
                        }`}
                      >
                        {name}
                      </h3>
                      <span
                        className={`text-[10px] tracking-widest2 uppercase px-3 py-1 shrink-0 ${
                          STATUS_STYLES[status] || STATUS_STYLES['In talks']
                        }`}
                      >
                        {status}
                      </span>
                    </div>
                    {v.kind && !isOpen && (
                      <p className="text-orange-dark text-[10px] tracking-widest2 uppercase mb-1.5">
                        {v.kind}
                      </p>
                    )}
                    <p className="text-ink/70 text-sm leading-relaxed">
                      {v.body ||
                        (isOpen
                          ? 'A single, distinct kitchen — partner not named yet.'
                          : '')}
                    </p>
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
