import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useContent } from '../lib/content'
import { openBookingModal } from './BookingModal'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeHref, setActiveHref] = useState(null)
  const [progress, setProgress] = useState(0)
  const settings = useContent('siteSettings')
  const progressRafRef = useRef(0)

  const brand = settings.brand || 'Landmark'
  const brandSuffix = settings.brandSuffix || 'Port Harcourt'
  const ctaLabel = settings.ctaLabel || 'Plan a Visit'
  const links = settings.navLinks || []

  // Scroll state (background swap) + top progress bar.
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      // Coalesce progress writes to rAF to avoid re-rendering per scroll tick.
      cancelAnimationFrame(progressRafRef.current)
      progressRafRef.current = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(progressRafRef.current)
    }
  }, [])

  // Active-section highlight — observe every section referenced by the
  // nav's hash links and mark whichever is closest to the viewport top.
  useEffect(() => {
    const hashes = links.map((l) => l.href).filter((h) => h?.startsWith('#'))
    const sections = hashes
      .map((h) => document.getElementById(h.slice(1)))
      .filter(Boolean)
    if (!sections.length) return

    // rootMargin trims the observer window so a section only counts as
    // "active" once its top has crossed roughly the middle of the viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the topmost intersecting section (there may be several while
        // sticky/pinned sections overlap).
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (visible) setActiveHref('#' + visible.target.id)
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [links])

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-colors duration-500 ${
          scrolled ? 'bg-sand/90 backdrop-blur-md border-b border-ink/5' : 'bg-transparent'
        }`}
      >
        {/* Top scroll progress bar — a thin thread of orange along the very
            top edge that widens as the reader moves down the page. */}
        <div className="absolute top-0 inset-x-0 h-0.5 bg-transparent">
          <div
            className="h-full bg-orange origin-left"
            style={{ transform: `scaleX(${progress})` }}
            aria-hidden="true"
          />
        </div>

        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 py-5">
          <a
            href="#top"
            className={`font-display text-lg tracking-wide transition-colors ${
              scrolled ? 'text-ink' : 'text-sand'
            }`}
          >
            {brand}{' '}
            <span className={scrolled ? 'text-orange-dark' : 'text-orange-light'}>
              ·
            </span>{' '}
            {brandSuffix}
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {links.map((l) => {
              const isActive = activeHref === l.href
              return (
                <a
                  key={l.href}
                  href={l.href}
                  aria-current={isActive ? 'true' : undefined}
                  className={`group relative text-sm tracking-wide transition-colors rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-dark ${
                    scrolled
                      ? isActive
                        ? 'text-orange-dark'
                        : 'text-ink/80 hover:text-orange-dark'
                      : isActive
                      ? 'text-orange-light'
                      : 'text-sand/80 hover:text-orange-light'
                  }`}
                >
                  {l.label}
                  {/* Animated underline — solid when active, slides in from
                      the left on hover otherwise. */}
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 right-0 -bottom-1 h-px origin-left transition-transform duration-500 ease-out ${
                      scrolled ? 'bg-orange-dark' : 'bg-orange-light'
                    } ${
                      isActive
                        ? 'scale-x-100'
                        : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </a>
              )
            })}
            <button
              type="button"
              onClick={() => openBookingModal()}
              className={`border px-5 py-2 text-sm tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-dark ${
                scrolled
                  ? 'border-orange-dark text-orange-dark hover:bg-orange-dark hover:text-sand'
                  : 'border-orange text-orange-light hover:bg-orange hover:text-ink'
              }`}
            >
              {ctaLabel}
            </button>
          </nav>

          <button
            className={`md:hidden transition-colors ${
              scrolled || open ? 'text-ink' : 'text-sand'
            }`}
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </header>

      {/* Full-screen mobile drawer — editorial vertical stack with staggered
          reveal. Sits under the header (so the close button stays reachable). */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-sand transition-opacity duration-500 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!open}
      >
        <div className="h-full flex flex-col justify-between px-8 pt-24 pb-10">
          <nav className="flex flex-col gap-2">
            {links.map((l, i) => {
              const isActive = activeHref === l.href
              return (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`group flex items-baseline gap-4 py-3 border-b border-ink/10 transition-transform duration-500 ease-out ${
                    open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`}
                  style={{ transitionDelay: open ? `${100 + i * 60}ms` : '0ms' }}
                >
                  <span className="font-display italic text-orange-dark text-xs tabular-nums w-6">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={`font-display text-3xl leading-none ${
                      isActive ? 'text-orange-dark italic' : 'text-ink'
                    }`}
                  >
                    {l.label}
                  </span>
                </a>
              )
            })}
          </nav>

          <div
            className={`transition-all duration-500 ease-out ${
              open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            style={{ transitionDelay: open ? `${100 + links.length * 60}ms` : '0ms' }}
          >
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                openBookingModal()
              }}
              className="w-full bg-orange-dark text-sand py-4 text-xs tracking-widest2 uppercase inline-flex items-center justify-center gap-3 hover:bg-orange transition-colors"
            >
              {ctaLabel}
              <span aria-hidden="true">→</span>
            </button>
            <p className="mt-6 text-ink/60 text-xs tracking-widest2 uppercase text-center">
              {brand} · {brandSuffix}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
