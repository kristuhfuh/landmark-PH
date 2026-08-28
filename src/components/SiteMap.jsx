import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import useRevealOnScroll from '../hooks/useRevealOnScroll'
import SplitHeading from './SplitHeading'
import { useContent } from '../lib/content'

/**
 * Site map: three zones + a walking loop, rendered as an editorial diagram.
 * Each node is clickable — jumps to that zone's section. Around the nodes
 * are floating side-labels (walking time, headline attraction) that make
 * the diagram read as a real chart, not a schematic.
 */

const DEFAULT_NODES = [
  {
    key: 'ring',
    label: 'The Ring',
    caption: 'Attractions',
    x: 300,
    y: 220,
    r: 52,
    href: '#the-ring',
    walk: 'Central',
    signature: 'Upside-Down Ship',
  },
  {
    key: 'green',
    label: 'The Green',
    caption: 'Sport & Adventure',
    x: 130,
    y: 120,
    r: 42,
    href: '#the-green',
    walk: '3 min · NW',
    signature: 'Concert lawn',
  },
  {
    key: 'waterfront',
    label: 'The Waterfront',
    caption: 'Beach & Water',
    x: 470,
    y: 140,
    r: 42,
    href: '#the-waterfront',
    walk: '4 min · NE',
    signature: 'Beach club',
  },
]

export default function SiteMap() {
  const ref = useRevealOnScroll({ stagger: 0.1 })
  const svgRef = useRef(null)
  const siteMap = useContent('siteMap')

  const eyebrow = siteMap.eyebrow || 'How the Grounds Sit Together'
  const heading = siteMap.heading || 'Three zones, one loop.'
  const caption =
    siteMap.caption ||
    'Simplified for orientation — not drawn to the scale of the construction plan.'
  const nodes = siteMap.nodes || DEFAULT_NODES

  useEffect(() => {
    const ctx = gsap.context(() => {
      const lines = svgRef.current.querySelectorAll('.path-line')
      lines.forEach((p) => {
        const len = p.getTotalLength()
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len })
        gsap.to(p, {
          strokeDashoffset: 0,
          duration: 1.6,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: svgRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        })
      })

      gsap.fromTo(
        svgRef.current.querySelectorAll('.node'),
        { opacity: 0, scale: 0.6, transformOrigin: 'center' },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: svgRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      )

      // Ambient pulse on the ring node — the "you go through here" beat.
      gsap.to('.node-pulse', {
        opacity: 0.3,
        scale: 1.4,
        duration: 2.2,
        ease: 'power2.out',
        repeat: -1,
        transformOrigin: 'center',
      })
    }, ref)
    return () => ctx.revert()
  }, [nodes.length])

  const jump = (href) => (e) => {
    e.preventDefault()
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section id="sitemap" ref={ref} className="bg-sand text-ink py-24 md:py-32 px-6 md:px-10">
      <div className="max-w-5xl mx-auto text-center mb-16">
        <p className="reveal inline-flex items-center gap-4 text-orange-dark text-xs tracking-widest2 uppercase mb-4">
          <span className="font-display italic text-orange-dark/90 text-base tabular-nums">08</span>
          <span aria-hidden="true" className="h-px w-8 bg-orange-dark/50" />
          {eyebrow}
        </p>
        <SplitHeading className="font-display text-3xl md:text-5xl">
          {heading}
        </SplitHeading>
      </div>

      <div className="relative max-w-4xl mx-auto reveal">
        {/* Legend along the top edge — key to how the diagram reads. */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[10px] tracking-widest2 uppercase text-ink/60 mb-8">
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-marine" /> Zone
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-px w-6 bg-orange" /> Primary approach
          </span>
          <span className="inline-flex items-center gap-2">
            <span
              className="h-px w-6 border-t border-dashed"
              style={{ borderColor: 'rgb(var(--c-ink) / 0.35)' }}
            />
            Walking loop
          </span>
        </div>

        <svg
          ref={svgRef}
          viewBox="0 0 600 400"
          className="w-full h-auto"
          role="img"
          aria-label="Diagram of the three zones and how they connect"
        >
          {/* Ambient grid ticks so it reads as a chart, not a sketch. */}
          <g stroke="rgb(var(--c-ink))" strokeOpacity="0.06" strokeWidth="0.5">
            {Array.from({ length: 7 }).map((_, i) => (
              <line key={`v-${i}`} x1={(i + 1) * 75} y1={30} x2={(i + 1) * 75} y2={370} />
            ))}
            {Array.from({ length: 5 }).map((_, i) => (
              <line key={`h-${i}`} x1={30} y1={(i + 1) * 66} x2={570} y2={(i + 1) * 66} />
            ))}
          </g>

          {/* Primary approaches — solid orange lines from the ring to each satellite zone */}
          {nodes.slice(1).map((n, i) => (
            <path
              key={`primary-${i}`}
              className="path-line"
              d={`M ${nodes[0].x} ${nodes[0].y} L ${n.x} ${n.y}`}
              stroke="rgb(var(--c-orange))"
              strokeWidth="1.75"
              fill="none"
            />
          ))}

          {/* Walking loop — dashed line connecting the two satellite zones directly */}
          {nodes.length >= 3 && (
            <path
              className="path-line"
              d={`M ${nodes[1].x} ${nodes[1].y} Q ${(nodes[1].x + nodes[2].x) / 2} ${Math.min(nodes[1].y, nodes[2].y) - 40} ${nodes[2].x} ${nodes[2].y}`}
              stroke="rgb(var(--c-ink))"
              strokeOpacity="0.4"
              strokeWidth="1"
              fill="none"
              strokeDasharray="4 6"
            />
          )}

          {/* Nodes */}
          {nodes.map((n, i) => {
            const isCentre = i === 0
            return (
              <g key={n.key} className="node cursor-pointer">
                <a href={n.href} onClick={jump(n.href)} aria-label={`Jump to ${n.label}`}>
                  {isCentre && (
                    <circle
                      className="node-pulse"
                      cx={n.x}
                      cy={n.y}
                      r={n.r}
                      fill="none"
                      stroke="rgb(var(--c-orange))"
                      strokeOpacity="0.7"
                      strokeWidth="1"
                    />
                  )}
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={n.r}
                    fill="rgb(var(--c-marine))"
                    stroke="rgb(var(--c-orange))"
                    strokeWidth="1.5"
                    className="transition-[fill] hover:fill-[rgb(var(--c-marine-light))]"
                  />
                  <text
                    x={n.x}
                    y={n.y - 4}
                    textAnchor="middle"
                    fill="rgb(var(--c-sand))"
                    fontSize={isCentre ? 14 : 12}
                    fontFamily="Manrope"
                    className="pointer-events-none"
                  >
                    {n.label}
                  </text>
                  <text
                    x={n.x}
                    y={n.y + 12}
                    textAnchor="middle"
                    fill="rgb(var(--c-orange))"
                    fontSize="9"
                    fontFamily="Manrope"
                    className="pointer-events-none"
                  >
                    {n.caption}
                  </text>
                </a>

                {/* Side annotation — floats out from each node, shows walking
                    time on top and the headline attraction below. */}
                <g
                  transform={`translate(${n.x + n.r + 12} ${n.y - 4})`}
                  className="pointer-events-none"
                >
                  <text
                    x="0"
                    y="0"
                    fontSize="8"
                    fontFamily="Manrope"
                    fill="rgb(var(--c-ink))"
                    fillOpacity="0.55"
                    letterSpacing="1"
                  >
                    {n.walk?.toUpperCase()}
                  </text>
                  <text
                    x="0"
                    y="14"
                    fontSize="11"
                    fontStyle="italic"
                    fontFamily="Instrument Serif, serif"
                    fill="rgb(var(--c-marine-dark))"
                  >
                    {n.signature}
                  </text>
                </g>
              </g>
            )
          })}
        </svg>

        {/* Clickable text list below the SVG — same content as the diagram
            for keyboard/screen-reader users, and as an on-page anchor list. */}
        <ul className="reveal mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 text-sm">
          {nodes.map((n) => (
            <li key={n.key} className="border-t border-ink/15 pt-4">
              <a
                href={n.href}
                onClick={jump(n.href)}
                className="group block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-dark"
              >
                <span className="block text-[10px] tracking-widest2 uppercase text-orange-dark/80 mb-1">
                  {n.walk}
                </span>
                <span className="block font-display text-marine text-xl md:text-2xl group-hover:text-orange-dark transition-colors">
                  {n.label}
                </span>
                <span className="block text-ink/60 text-xs mt-1">{n.caption} · {n.signature}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <p className="reveal text-center text-ink/60 text-xs max-w-lg mx-auto mt-10">
        {caption}
      </p>
    </section>
  )
}
