import { useEffect, useState } from 'react'

const ZONES = [
  { id: 'the-concept', label: 'The Concept' },
  { id: 'the-flagship', label: 'Signature Attraction' },
  { id: 'the-ring', label: 'Zone One · The Ring' },
  { id: 'the-green', label: 'Zone Two · The Green' },
  { id: 'the-waterfront', label: 'Zone Three · The Waterfront' },
  { id: 'table', label: 'At the Table' },
  { id: 'sitemap', label: 'Site Map' },
  { id: 'visit', label: 'Plan a Visit' },
]

/**
 * Tiny always-visible label anchored to the top-left, tracking which zone
 * the reader is currently inside. Uses IntersectionObserver against each
 * zone's section id so we don't hammer scroll events.
 *
 * Hidden while over the hero (no zone active yet) and on small screens.
 */
export default function StickyZoneLabel() {
  const [activeLabel, setActiveLabel] = useState(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Choose the entry closest to the top of the viewport that is intersecting.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length) {
          const id = visible[0].target.id
          const zone = ZONES.find((z) => z.id === id)
          if (zone) setActiveLabel(zone.label)
        }
      },
      { rootMargin: '-15% 0px -70% 0px' }
    )

    ZONES.forEach((z) => {
      const el = document.getElementById(z.id)
      if (el) observer.observe(el)
    })

    // Clear the label when the user scrolls back to the very top.
    const onScroll = () => {
      if (window.scrollY < 200) setActiveLabel(null)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div
      className="fixed top-24 left-6 md:left-10 z-40 pointer-events-none hidden md:block"
      aria-hidden="true"
    >
      <span
        key={activeLabel || 'empty'}
        className={`inline-block text-[11px] tracking-widest2 uppercase text-marine-dark/70 transition-opacity duration-500 ${
          activeLabel ? 'opacity-100 animate-[fadeIn_0.5s_ease-out]' : 'opacity-0'
        }`}
      >
        {activeLabel || ' '}
      </span>
    </div>
  )
}
