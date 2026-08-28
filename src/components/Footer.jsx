import { useState } from 'react'
import { Instagram, Facebook, Youtube, Linkedin, ArrowRight, Check } from 'lucide-react'
import { useContent } from '../lib/content'

const EXPLORE_LINKS = [
  { label: 'Home', href: '#top' },
  { label: 'About Us', href: '#the-concept' },
  { label: 'Rooms', href: '#rooms' },
  { label: 'Blog', href: '#' },
  { label: 'Gallery', href: '#the-green' },
]

const EXPERIENCES_LINKS = [
  { label: 'Things To Do', href: '#the-ring' },
  { label: 'Event Spaces', href: '#the-green' },
  { label: 'Contact', href: '#visit' },
  { label: 'Book a Stay', href: '#visit' },
  { label: 'Book a Package', href: '#visit' },
]

const LANDMARK_LINKS = [
  { label: 'Landmark Nike Lake Resort', href: '#' },
  { label: 'Landmark Upside Down House', href: '#the-flagship' },
  { label: 'Landmark Hotel', href: '#' },
  { label: 'Landmark Africa', href: '#' },
]

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms and Conditions', href: '#' },
  { label: 'Cookie Policy', href: '#' },
]

const SOCIAL_LINKS = [
  { label: 'Instagram', href: '#', Icon: Instagram },
  { label: 'Facebook', href: '#', Icon: Facebook },
  { label: 'YouTube', href: '#', Icon: Youtube },
  { label: 'LinkedIn', href: '#', Icon: Linkedin },
]

export default function Footer() {
  const settings = useContent('siteSettings')
  const brand = settings.brand || 'Landmark'
  const brandSuffix = settings.brandSuffix || 'Port Harcourt'
  const [email, setEmail] = useState('')
  const [accepted, setAccepted] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  function handleSubscribe(e) {
    e.preventDefault()
    // Wire up to a real endpoint later.
    setSubscribed(true)
    setEmail('')
    setAccepted(false)
    // Auto-reset the success state after a moment so the form is usable again.
    setTimeout(() => setSubscribed(false), 6000)
  }

  return (
    <footer className="bg-sand text-marine-dark">
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-10">
        <div className="grid md:grid-cols-12 gap-10 md:gap-14">
          {/* Brand + description + subscribe */}
          <div className="md:col-span-5">
            <div className="inline-block mb-6">
              <div className="font-display text-3xl font-medium tracking-wide leading-none">
                {brand.toUpperCase()}
              </div>
              <div className="mt-2 pt-2 border-t border-marine-dark/30 text-[10px] tracking-widest2 uppercase">
                {brandSuffix}
              </div>
            </div>

            <p className="text-sm leading-relaxed text-marine-dark/85 mb-8 max-w-xs">
              Discover premium hospitality, comfortable stays, exciting
              experiences, and memorable moments at {brand} {brandSuffix}.
            </p>

            {subscribed ? (
              <div className="max-w-md border border-orange-dark/40 bg-white/60 px-5 py-4 flex items-start gap-3 text-sm text-marine-dark">
                <span className="mt-0.5 h-6 w-6 rounded-full border border-orange-dark/50 flex items-center justify-center shrink-0">
                  <Check size={14} className="text-orange-dark" />
                </span>
                <div>
                  <p className="font-display italic text-base leading-tight mb-1">
                    You're on the list.
                  </p>
                  <p className="text-marine-dark/70 text-xs leading-relaxed">
                    We'll write when the beach club opens and when phase-one
                    dates firm up. No noise in between.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <label className="flex items-center gap-2 text-sm text-marine-dark/85 mb-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={accepted}
                    onChange={(e) => setAccepted(e.target.checked)}
                    className="h-4 w-4 accent-orange border border-marine-dark/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-dark"
                  />
                  <span>
                    I accept the{' '}
                    <a href="#" className="underline underline-offset-2">
                      Privacy Policy
                    </a>
                  </span>
                </label>

                <form
                  onSubmit={handleSubscribe}
                  className="flex max-w-md rounded-sm overflow-hidden border border-marine-dark/20 bg-white"
                >
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 px-4 py-3 bg-transparent text-sm text-marine-dark placeholder:text-marine-dark/40 outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!accepted}
                    className="px-5 py-3 bg-orange text-white text-sm font-medium hover:bg-orange-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-dark"
                  >
                    Subscribe
                    <ArrowRight size={14} />
                  </button>
                </form>
              </>
            )}

            {/* Socials — small, discreet, sits under the subscribe block. */}
            <ul className="mt-8 flex items-center gap-3">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    aria-label={label}
                    className="h-10 w-10 rounded-full border border-marine-dark/25 flex items-center justify-center text-marine-dark hover:border-orange-dark hover:text-orange-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-dark"
                  >
                    <Icon size={16} strokeWidth={1.5} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Link columns */}
          <FooterColumn title="Explore" links={EXPLORE_LINKS} className="md:col-span-2 md:col-start-7" />
          <FooterColumn title="Experiences" links={EXPERIENCES_LINKS} className="md:col-span-2" />
          <FooterColumn title="Landmark" links={LANDMARK_LINKS} className="md:col-span-2" />
        </div>
      </div>

      <div className="border-t border-marine-dark/15">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-marine-dark/85">
          <p>
            &copy;{new Date().getFullYear()} — Landmark Group. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-6 md:gap-8">
            {LEGAL_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="underline underline-offset-2 hover:text-orange-dark transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Watermark: only the top 3/4 of the wordmark is visible; the bottom
          quarter clips at the footer's edge. Low-opacity marine so it reads
          as ambient background typography, not a heading. */}
      <div
        className="relative overflow-hidden"
        style={{ height: 'clamp(3.75rem, 16.5vw, 16.5rem)' }}
      >
        <h2
          aria-hidden="true"
          className="absolute top-0 inset-x-0 font-display font-light text-marine-dark/20 leading-none tracking-tight text-center select-none px-2"
          style={{ fontSize: 'clamp(5rem, 22vw, 22rem)' }}
        >
          {brand}
        </h2>
      </div>
    </footer>
  )
}

function FooterColumn({ title, links, className = '' }) {
  return (
    <div className={className}>
      <h3 className="text-[13px] tracking-widest2 uppercase font-normal text-marine-dark/70 mb-5">
        {title}
      </h3>
      <ul className="space-y-3.5 text-sm">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              className="text-marine-dark font-medium hover:text-orange-dark transition-colors"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
