import { useEffect, useRef, useState } from 'react'
import { Menu, X, ShoppingBag, Phone, Mail, MapPin } from 'lucide-react'
import { useContent } from '../lib/content'
import { useCart } from '../lib/cart'
import { openBookingModal } from './BookingModal'

/**
 * Top bar + right-side navigation sidesheet.
 *
 * Bar: brand on the left; cart icon + hamburger on the right (with the
 * "Plan a Visit" CTA sitting inline on desktop). No inline nav links — all
 * links live in the sidesheet so the top bar can breathe and stay editorial
 * at every breakpoint.
 *
 * Sidesheet: right-slide panel. Numbered nav items, active-state italic,
 * contact info block, brand watermark at the bottom. Same drawer for
 * desktop and mobile — one behaviour to reason about.
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeHref, setActiveHref] = useState(null)
  const [progress, setProgress] = useState(0)
  const settings = useContent('siteSettings')
  const progressRafRef = useRef(0)
  const closeBtnRef = useRef(null)
  const { totalCount, setOpen: setCartOpen } = useCart()

  const brand = settings.brand || 'Landmark'
  const brandSuffix = settings.brandSuffix || 'Port Harcourt'
  const ctaLabel = settings.ctaLabel || 'Plan a Visit'
  const links = settings.navLinks || []
  const contact = settings.contact || {}

  // Scroll state (background swap) + top progress bar.
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      // rAF-coalesced so we don't render on every wheel tick.
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

  // Active-section highlight — mark whichever section is nearest the middle.
  useEffect(() => {
    const hashes = links.map((l) => l.href).filter((h) => h?.startsWith('#'))
    const sections = hashes
      .map((h) => document.getElementById(h.slice(1)))
      .filter(Boolean)
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
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

  // Lock body scroll while the sidesheet is open + Escape closes it.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeBtnRef.current?.focus()
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  const isDark = !scrolled

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-colors duration-500 ${
          scrolled ? 'bg-sand/90 backdrop-blur-md border-b border-ink/5' : 'bg-transparent'
        }`}
      >
        {/* Top-edge scroll progress */}
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
            <span className={scrolled ? 'text-orange-dark' : 'text-orange-light'}>·</span>{' '}
            {brandSuffix}
          </a>

          <div className="flex items-center gap-4 md:gap-5">
            <CartButton
              scrolled={scrolled}
              totalCount={totalCount}
              onClick={() => setCartOpen(true)}
            />
            <button
              type="button"
              onClick={() => openBookingModal()}
              className={`hidden md:inline-flex border px-5 py-2 text-sm tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-dark ${
                scrolled
                  ? 'border-orange-dark text-orange-dark hover:bg-orange-dark hover:text-sand'
                  : 'border-orange text-orange-light hover:bg-orange hover:text-ink'
              }`}
            >
              {ctaLabel}
            </button>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className={`inline-flex items-center gap-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-dark ${
                isDark ? 'text-sand hover:text-orange-light' : 'text-ink hover:text-orange-dark'
              }`}
            >
              <span className="hidden md:inline text-[11px] tracking-widest2 uppercase">
                Menu
              </span>
              <Menu size={22} strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </header>

      {/* Scrim */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[70] bg-ink/60 backdrop-blur-sm transition-opacity duration-500 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* Full-page sidesheet — enters from the left with an asymmetric
          clip-path animation: the top-right corner reaches its final
          position ~400ms before the bottom-right does, so the reveal
          feels like the sheet is unfurling from the top-left. */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        aria-hidden={!open}
        className={`sidesheet-panel fixed top-0 left-0 h-full w-full z-[80] bg-sand text-ink ${
          open ? 'is-open' : ''
        }`}
      >
        <div className="h-full flex flex-col">
          <header className="flex items-center justify-between px-8 md:px-16 pt-8 pb-6 border-b border-ink/10">
            <div>
              <p className="text-orange-dark text-[11px] tracking-widest2 uppercase">
                Explore
              </p>
              <p className="font-display italic text-ink/60 text-sm mt-1">
                {brand} · {brandSuffix}
              </p>
            </div>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="text-ink/70 hover:text-ink transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-dark rounded-full"
            >
              <X size={22} />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-8 md:px-16 py-10 md:py-14">
            <div className="max-w-4xl mx-auto w-full">
            <nav className="flex flex-col gap-1" aria-label="Primary">
              {links.map((l, i) => {
                const isActive = activeHref === l.href
                return (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={`group flex items-baseline gap-5 py-3.5 border-b border-ink/10 transition-transform duration-500 ease-out ${
                      open
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-4 opacity-0'
                    }`}
                    style={{
                      transitionDelay: open ? `${100 + i * 60}ms` : '0ms',
                    }}
                  >
                    <span className="font-display italic text-orange-dark text-xs tabular-nums w-6 shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={`font-display leading-none flex-1 transition-colors ${
                        isActive
                          ? 'text-orange-dark italic'
                          : 'text-ink group-hover:text-orange-dark'
                      }`}
                      style={{ fontSize: 'clamp(2rem, 6vw, 4rem)' }}
                    >
                      {l.label}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`text-lg transition-transform duration-300 ${
                        isActive
                          ? 'text-orange-dark translate-x-0'
                          : 'text-ink/30 group-hover:text-orange-dark group-hover:translate-x-1'
                      }`}
                    >
                      →
                    </span>
                  </a>
                )
              })}
            </nav>

            {/* Contact rail — direct-reach shortcuts under the nav. */}
            <div
              className={`mt-10 pt-8 border-t border-ink/10 transition-transform duration-500 ease-out ${
                open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              style={{
                transitionDelay: open ? `${100 + links.length * 60}ms` : '0ms',
              }}
            >
              <p className="text-[10px] tracking-widest2 uppercase text-ink/55 mb-4">
                Reach us
              </p>
              <ul className="space-y-3 text-sm text-ink/80">
                {contact.phone && (
                  <li>
                    <a
                      href={`tel:${String(contact.phone).replace(/\s+/g, '')}`}
                      className="inline-flex items-center gap-3 hover:text-orange-dark transition-colors"
                    >
                      <Phone size={14} strokeWidth={1.75} />
                      {contact.phone}
                    </a>
                  </li>
                )}
                {contact.email && (
                  <li>
                    <a
                      href={`mailto:${contact.email}`}
                      className="inline-flex items-center gap-3 hover:text-orange-dark transition-colors"
                    >
                      <Mail size={14} strokeWidth={1.75} />
                      {contact.email}
                    </a>
                  </li>
                )}
                {contact.addressLines?.length > 0 && (
                  <li className="flex items-start gap-3">
                    <MapPin size={14} strokeWidth={1.75} className="mt-0.5 shrink-0" />
                    <span>{contact.addressLines.join(', ')}</span>
                  </li>
                )}
              </ul>
            </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div
            className={`px-8 md:px-16 pb-10 pt-4 border-t border-ink/10 transition-transform duration-500 ease-out ${
              open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            style={{
              transitionDelay: open ? `${100 + (links.length + 1) * 60}ms` : '0ms',
            }}
          >
            <div className="max-w-4xl mx-auto w-full">
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  openBookingModal()
                }}
                className="w-full inline-flex items-center justify-center gap-3 bg-orange-dark text-sand py-4 text-xs tracking-widest2 uppercase hover:bg-orange transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-dark"
              >
                {ctaLabel}
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

function CartButton({ scrolled, totalCount, onClick }) {
  const tone = scrolled
    ? 'text-ink hover:text-orange-dark'
    : 'text-sand hover:text-orange-light'
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Open cart (${totalCount} ${totalCount === 1 ? 'item' : 'items'})`}
      className={`relative inline-flex items-center gap-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-dark ${tone}`}
    >
      <ShoppingBag size={20} strokeWidth={1.75} />
      {totalCount > 0 && (
        <span
          className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-orange-dark text-sand text-[10px] font-medium tabular-nums inline-flex items-center justify-center"
          aria-hidden="true"
        >
          {totalCount > 99 ? '99+' : totalCount}
        </span>
      )}
    </button>
  )
}
