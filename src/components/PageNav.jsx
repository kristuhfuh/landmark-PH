import { Link, useLocation } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useContent } from '../lib/content'
import { openBookingModal } from './BookingModal'

const LINKS = [
  { label: 'About', to: '/about' },
  { label: 'Things to Do', to: '/things-to-do' },
  { label: 'Bookings', to: '/bookings' },
  { label: 'Contact', to: '/contact' },
]

/**
 * Minimal top bar for interior routes. Sand background, brand at left,
 * inter-page links + CTA at right. Matches the editorial voice of the
 * main navbar without duplicating its sidesheet complexity.
 */
export default function PageNav() {
  const settings = useContent('siteSettings')
  const brand = settings.brand || 'Landmark'
  const brandSuffix = settings.brandSuffix || 'Port Harcourt'
  const ctaLabel = settings.ctaLabel || 'Plan a Visit'
  const { pathname } = useLocation()

  return (
    <header className="sticky top-0 z-40 bg-sand/90 backdrop-blur-md border-b border-ink/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 py-5">
        <Link
          to="/"
          className="inline-flex items-center gap-3 font-display text-lg tracking-wide text-ink hover:text-orange-dark transition-colors"
        >
          <ArrowLeft size={16} strokeWidth={1.75} className="text-orange-dark" />
          {brand}
          <span className="text-orange-dark">·</span>
          <span className="text-ink/70">{brandSuffix}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8" aria-label="Sections">
          {LINKS.map((l) => {
            const active = pathname === l.to
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`text-[11px] tracking-widest2 uppercase transition-colors ${
                  active
                    ? 'text-orange-dark italic'
                    : 'text-ink/70 hover:text-orange-dark'
                }`}
              >
                {l.label}
              </Link>
            )
          })}
        </nav>

        <button
          type="button"
          onClick={() => openBookingModal()}
          className="border border-orange-dark px-5 py-2 text-xs tracking-widest2 uppercase text-orange-dark hover:bg-orange-dark hover:text-sand transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-dark"
        >
          {ctaLabel}
        </button>
      </div>

      {/* Mobile inline nav */}
      <nav
        className="md:hidden flex items-center gap-5 overflow-x-auto scrollbar-none px-6 pb-3"
        aria-label="Sections"
      >
        {LINKS.map((l) => {
          const active = pathname === l.to
          return (
            <Link
              key={l.to}
              to={l.to}
              className={`shrink-0 text-[10px] tracking-widest2 uppercase transition-colors ${
                active ? 'text-orange-dark italic' : 'text-ink/70'
              }`}
            >
              {l.label}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
